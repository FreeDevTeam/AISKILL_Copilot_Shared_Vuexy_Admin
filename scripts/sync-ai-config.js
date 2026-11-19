#!/usr/bin/env node
/**
 * Đồng bộ skill / instruction / file config AI từ repo shared này sang các repo dự án
 * (được add vào thư mục `projects/` dưới dạng git submodule).
 *
 * Nguyên tắc:
 *   - CHỈ thêm mới hoặc ghi đè file TRÙNG TÊN. Không bao giờ xoá file của repo đích,
 *     vì mỗi repo vẫn có skill / instruction / config riêng theo dự án.
 *   - File config có tên cố định (AGENTS.md, CLAUDE.md, ...) dùng chế độ "block":
 *     chỉ thay phần nằm giữa 2 marker, phần nội dung riêng của dự án được giữ nguyên.
 *   - File JSON (ví dụ .vscode/settings.json) dùng chế độ "json-merge": merge key, giữ key riêng.
 *
 * Cách dùng:
 *   node scripts/sync-ai-config.js                      # checkout + copy cho tất cả target (không commit)
 *   node scripts/sync-ai-config.js --target <name>      # chỉ 1 target (lặp lại flag để chọn nhiều)
 *   node scripts/sync-ai-config.js --dry-run            # chỉ in ra thay đổi, không ghi file
 *   node scripts/sync-ai-config.js --no-checkout        # dùng nguyên source hiện có trong submodule
 *   node scripts/sync-ai-config.js --push               # commit + push (+ tạo PR nếu git.pushMode = "pr")
 *   node scripts/sync-ai-config.js add <owner/repo> [--branch <b>] [--path <p>] [--name <n>]
 *                                                       # add 1 repo mới làm submodule + đăng ký vào config
 *
 * Biến môi trường:
 *   AI_SYNC_TOKEN | GH_TOKEN | GITHUB_TOKEN   token dùng để gọi GitHub API tạo PR (pushMode = "pr")
 *
 * Không cần cài dependency (chỉ dùng module có sẵn của NodeJS >= 18).
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const CONFIG_FILE = path.join(ROOT_DIR, 'ai-sync.config.json');
const GITMODULES_FILE = path.join(ROOT_DIR, '.gitmodules');

const MODE_OVERWRITE = 'overwrite';
const MODE_BLOCK = 'block';
const MODE_JSON_MERGE = 'json-merge';

const PUSH_MODE_PR = 'pr';
const PUSH_MODE_DIRECT = 'direct';
const PUSH_MODE_NONE = 'none';

const RESULT_CREATED = 'created';
const RESULT_UPDATED = 'updated';
const RESULT_UNCHANGED = 'unchanged';
const RESULT_SKIPPED = 'skipped';

main().catch(function onMainError(error) {
  console.error(`\n[ai-sync] LỖI: ${error.message}`);
  process.exit(1);
});

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const config = readConfig();

  if (args.command === 'add') {
    addTarget(config, args);
    return;
  }

  const targets = selectTargets(config, args.targets);
  if (targets.length === 0) {
    console.log('[ai-sync] Không có target nào để đồng bộ.');
    return;
  }

  const failedTargets = [];
  for (const target of targets) {
    try {
      await syncTarget(config, target, args);
    } catch (error) {
      console.error(`[ai-sync] ✗ ${target.name}: ${error.message}`);
      failedTargets.push(target.name);
    }
  }

  if (failedTargets.length > 0) {
    throw new Error(`Đồng bộ thất bại cho: ${failedTargets.join(', ')}`);
  }
  console.log('\n[ai-sync] Hoàn tất.');
}

// ---------------------------------------------------------------------------
// CLI / config
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = {
    command: 'sync',
    repo: null,
    targets: [],
    dryRun: false,
    checkout: true,
    push: false,
    branch: null,
    path: null,
    name: null,
  };

  let index = 0;
  if (argv[0] === 'add') {
    args.command = 'add';
    args.repo = argv[1];
    index = 2;
  }

  for (; index < argv.length; index++) {
    const arg = argv[index];
    switch (arg) {
      case '--target':
        args.targets.push(argv[++index]);
        break;
      case '--dry-run':
        args.dryRun = true;
        break;
      case '--no-checkout':
        args.checkout = false;
        break;
      case '--push':
        args.push = true;
        break;
      case '--branch':
        args.branch = argv[++index];
        break;
      case '--path':
        args.path = argv[++index];
        break;
      case '--name':
        args.name = argv[++index];
        break;
      default:
        throw new Error(`Tham số không hợp lệ: ${arg}`);
    }
  }

  return args;
}

function readConfig() {
  if (!fs.existsSync(CONFIG_FILE)) {
    throw new Error(`Không tìm thấy file config: ${CONFIG_FILE}`);
  }
  const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  if (!Array.isArray(config.targets)) {
    config.targets = [];
  }
  if (!Array.isArray(config.mappings)) {
    throw new Error('ai-sync.config.json: thiếu "mappings"');
  }
  config.git = Object.assign(
    {
      syncBranch: 'chore/sync-ai-skills',
      pushMode: PUSH_MODE_PR,
      commitMessage: 'chore(ai): sync shared AI skills, instructions and agent configs',
      authorName: 'ai-skill-sync-bot',
      authorEmail: 'ai-skill-sync-bot@users.noreply.github.com',
    },
    config.git || {},
  );
  return config;
}

function writeConfig(config) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2) + '\n');
}

function selectTargets(config, targetNames) {
  const enabledTargets = config.targets.filter(function isEnabled(target) {
    return target.enabled !== false;
  });
  if (targetNames.length === 0) {
    return enabledTargets.map(resolveTarget);
  }

  const selectedTargets = [];
  for (const targetName of targetNames) {
    const target = config.targets.find(function matchName(item) {
      return item.name === targetName;
    });
    if (!target) {
      throw new Error(`Không tìm thấy target "${targetName}" trong ai-sync.config.json`);
    }
    selectedTargets.push(resolveTarget(target));
  }
  return selectedTargets;
}

/** Bổ sung url / branch từ .gitmodules (nguồn chính) cho target. */
function resolveTarget(target) {
  const url = readGitmodulesValue(target.path, 'url');
  const branch = target.branch || readGitmodulesValue(target.path, 'branch');
  if (!url) {
    throw new Error(`Submodule "${target.path}" chưa được khai báo trong .gitmodules`);
  }
  if (!branch) {
    throw new Error(`Target "${target.name}" chưa có branch (khai báo "branch" trong .gitmodules)`);
  }
  return Object.assign({}, target, {
    url: url,
    branch: branch,
    absolutePath: path.join(ROOT_DIR, target.path),
    repoFullName: parseRepoFullName(url),
  });
}

function readGitmodulesValue(submodulePath, key) {
  if (!fs.existsSync(GITMODULES_FILE)) {
    return null;
  }
  try {
    return git(ROOT_DIR, ['config', '-f', '.gitmodules', `submodule.${submodulePath}.${key}`]).trim();
  } catch (error) {
    return null;
  }
}

function parseRepoFullName(url) {
  const match = url.match(/github\.com[:/]([^/]+)\/([^/]+?)(\.git)?$/);
  if (!match) {
    return null;
  }
  return `${match[1]}/${match[2]}`;
}

// ---------------------------------------------------------------------------
// add <owner/repo>
// ---------------------------------------------------------------------------

function addTarget(config, args) {
  if (!args.repo || !/^[^/\s]+\/[^/\s]+$/.test(args.repo)) {
    throw new Error('Cú pháp: node scripts/sync-ai-config.js add <owner/repo> [--branch <b>] [--path <p>] [--name <n>]');
  }
  const repoName = args.repo.split('/')[1];
  const targetName = args.name || repoName;
  const submodulePath = args.path || `projects/${repoName}`;
  const url = `https://github.com/${args.repo}.git`;

  const existed = config.targets.find(function matchTarget(target) {
    return target.name === targetName || target.path === submodulePath;
  });
  if (existed) {
    throw new Error(`Target "${targetName}" / path "${submodulePath}" đã tồn tại trong config`);
  }

  const submoduleArgs = ['submodule', 'add', '--depth', '1'];
  if (args.branch) {
    submoduleArgs.push('-b', args.branch);
  }
  submoduleArgs.push(url, submodulePath);
  console.log(`[ai-sync] git ${submoduleArgs.join(' ')}`);
  git(ROOT_DIR, submoduleArgs, { stdio: 'inherit' });

  if (!args.branch) {
    const defaultBranch = git(path.join(ROOT_DIR, submodulePath), ['rev-parse', '--abbrev-ref', 'HEAD']).trim();
    git(ROOT_DIR, ['config', '-f', '.gitmodules', `submodule.${submodulePath}.branch`, defaultBranch]);
  }

  config.targets.push({ name: targetName, path: submodulePath, enabled: true });
  writeConfig(config);
  git(ROOT_DIR, ['add', '.gitmodules', 'ai-sync.config.json', submodulePath]);
  console.log(`[ai-sync] Đã add target "${targetName}" (${submodulePath}). Hãy review rồi commit.`);
}

// ---------------------------------------------------------------------------
// sync
// ---------------------------------------------------------------------------

async function syncTarget(config, target, args) {
  console.log(`\n[ai-sync] ===== ${target.name} (${target.repoFullName || target.url} @ ${target.branch}) =====`);

  const usePrBranch = args.push && config.git.pushMode === PUSH_MODE_PR;
  if (args.checkout) {
    checkoutTarget(target, usePrBranch ? config.git.syncBranch : target.branch);
  } else if (!fs.existsSync(path.join(target.absolutePath, '.git'))) {
    throw new Error(`Submodule chưa được checkout: ${target.path} (bỏ --no-checkout)`);
  }

  const summary = { created: 0, updated: 0, unchanged: 0, skipped: 0 };
  for (const mapping of config.mappings) {
    if (!isMappingEnabledForTarget(mapping, target)) {
      continue;
    }
    applyMapping(mapping, target, args.dryRun, summary);
  }
  console.log(
    `[ai-sync] ${target.name}: ${summary.created} tạo mới, ${summary.updated} cập nhật, ` +
      `${summary.unchanged} không đổi, ${summary.skipped} bỏ qua`,
  );

  if (!args.push || args.dryRun || config.git.pushMode === PUSH_MODE_NONE) {
    return;
  }
  await commitAndPush(config, target);
}

function isMappingEnabledForTarget(mapping, target) {
  if (mapping.enabled === false) {
    return false;
  }
  const excluded = target.excludeMappings || [];
  return !excluded.includes(mapping.to);
}

/**
 * Checkout source mới nhất của branch gốc trong submodule.
 * Nếu workBranch khác branch gốc (chế độ PR) thì tạo lại workBranch từ branch gốc mới nhất.
 */
function checkoutTarget(target, workBranch) {
  console.log(`[ai-sync] Checkout ${target.path} ...`);
  git(ROOT_DIR, ['submodule', 'sync', '--', target.path]);
  git(ROOT_DIR, ['submodule', 'update', '--init', '--depth', '1', '--', target.path], { stdio: 'inherit' });
  git(target.absolutePath, ['fetch', '--depth', '1', 'origin', target.branch], { stdio: 'inherit' });
  git(target.absolutePath, ['checkout', '-B', workBranch, 'FETCH_HEAD']);
}

function applyMapping(mapping, target, dryRun, summary) {
  const sourcePath = path.join(ROOT_DIR, mapping.from);
  if (!fs.existsSync(sourcePath)) {
    console.warn(`[ai-sync]   ! Bỏ qua mapping, không có source: ${mapping.from}`);
    return;
  }
  const destinationPath = path.join(target.absolutePath, mapping.to);
  const mode = mapping.mode || MODE_OVERWRITE;
  const excludePatterns = mapping.exclude || [];

  const files = listFiles(sourcePath);
  for (const relativeFile of files) {
    if (isExcluded(relativeFile, excludePatterns)) {
      continue;
    }
    const sourceFile = relativeFile ? path.join(sourcePath, relativeFile) : sourcePath;
    const destinationFile = relativeFile ? path.join(destinationPath, relativeFile) : destinationPath;
    const result = syncFile(sourceFile, destinationFile, mode, dryRun);
    summary[result]++;
    if (result !== RESULT_UNCHANGED) {
      console.log(`[ai-sync]   ${result.padEnd(9)} ${path.relative(target.absolutePath, destinationFile)}`);
    }
  }
}

/** Trả về danh sách file (đường dẫn tương đối). Nếu source là 1 file thì trả về [''] */
function listFiles(sourcePath) {
  if (fs.statSync(sourcePath).isFile()) {
    return [''];
  }
  const files = [];
  walkDirectory(sourcePath, '', files);
  return files.sort();
}

function walkDirectory(baseDirectory, relativeDirectory, files) {
  const entries = fs.readdirSync(path.join(baseDirectory, relativeDirectory), { withFileTypes: true });
  for (const entry of entries) {
    const relativePath = path.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) {
      walkDirectory(baseDirectory, relativePath, files);
    } else if (entry.isFile()) {
      files.push(relativePath);
    }
  }
}

function isExcluded(relativeFile, excludePatterns) {
  const normalizedFile = relativeFile.split(path.sep).join('/');
  for (const pattern of excludePatterns) {
    if (normalizedFile === pattern || normalizedFile.startsWith(`${pattern}/`) || path.basename(normalizedFile) === pattern) {
      return true;
    }
  }
  return false;
}

function syncFile(sourceFile, destinationFile, mode, dryRun) {
  const sourceContent = fs.readFileSync(sourceFile, 'utf8');
  const destinationExists = fs.existsSync(destinationFile);
  const currentContent = destinationExists ? fs.readFileSync(destinationFile, 'utf8') : null;

  let nextContent = null;
  switch (mode) {
    case MODE_OVERWRITE:
      nextContent = sourceContent;
      break;
    case MODE_BLOCK:
      nextContent = buildBlockContent(currentContent, sourceContent, destinationFile);
      break;
    case MODE_JSON_MERGE:
      nextContent = buildJsonMergeContent(currentContent, sourceContent, destinationFile);
      break;
    default:
      throw new Error(`Mode không hợp lệ: ${mode}`);
  }

  if (nextContent === null) {
    return RESULT_SKIPPED;
  }
  if (nextContent === currentContent) {
    return RESULT_UNCHANGED;
  }
  if (!dryRun) {
    fs.mkdirSync(path.dirname(destinationFile), { recursive: true });
    fs.writeFileSync(destinationFile, nextContent);
  }
  if (destinationExists) {
    return RESULT_UPDATED;
  }
  return RESULT_CREATED;
}

/**
 * Chế độ block: nội dung shared được bọc giữa 2 marker.
 * - File chưa có: tạo mới chỉ gồm block.
 * - File đã có marker: thay phần giữa 2 marker.
 * - File đã có nhưng chưa có marker: thêm block vào cuối file, giữ nguyên nội dung cũ.
 */
function buildBlockContent(currentContent, sourceContent, destinationFile) {
  const markers = getBlockMarkers(destinationFile);
  const block = `${markers.begin}\n${sourceContent.trim()}\n${markers.end}`;

  if (currentContent === null) {
    return `${block}\n`;
  }

  const beginIndex = currentContent.indexOf(markers.begin);
  const endIndex = currentContent.indexOf(markers.end);
  if (beginIndex !== -1 && endIndex > beginIndex) {
    return currentContent.slice(0, beginIndex) + block + currentContent.slice(endIndex + markers.end.length);
  }
  if (beginIndex !== -1 || endIndex !== -1) {
    console.warn(`[ai-sync]   ! Marker bị hỏng trong ${destinationFile}, bỏ qua file này`);
    return null;
  }
  return `${currentContent.replace(/\s*$/, '')}\n\n${block}\n`;
}

function getBlockMarkers(destinationFile) {
  const label = 'AISKILL-SHARED (tự động đồng bộ từ repo shared, KHÔNG sửa tay trong block này)';
  const extension = path.extname(destinationFile).toLowerCase();
  if (extension === '.md' || extension === '.mdc' || extension === '') {
    return { begin: `<!-- BEGIN ${label} -->`, end: '<!-- END AISKILL-SHARED -->' };
  }
  return { begin: `# BEGIN ${label}`, end: '# END AISKILL-SHARED' };
}

/** Chế độ json-merge: deep merge, key của shared ghi đè key trùng, key riêng của dự án được giữ. */
function buildJsonMergeContent(currentContent, sourceContent, destinationFile) {
  const sourceJson = JSON.parse(sourceContent);
  if (currentContent === null) {
    return `${JSON.stringify(sourceJson, null, 2)}\n`;
  }
  let currentJson = null;
  try {
    currentJson = JSON.parse(currentContent);
  } catch (error) {
    console.warn(`[ai-sync]   ! ${destinationFile} không phải JSON thuần (có comment?), bỏ qua merge`);
    return null;
  }
  const mergedJson = deepMerge(currentJson, sourceJson);
  const mergedContent = `${JSON.stringify(mergedJson, null, 2)}\n`;
  if (JSON.stringify(mergedJson) === JSON.stringify(currentJson)) {
    return currentContent;
  }
  return mergedContent;
}

function deepMerge(baseValue, overrideValue) {
  if (!isPlainObject(baseValue) || !isPlainObject(overrideValue)) {
    return overrideValue;
  }
  const result = Object.assign({}, baseValue);
  for (const key of Object.keys(overrideValue)) {
    result[key] = deepMerge(baseValue[key], overrideValue[key]);
  }
  return result;
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

// ---------------------------------------------------------------------------
// commit / push / pull request
// ---------------------------------------------------------------------------

async function commitAndPush(config, target) {
  const destinations = collectDestinations(config, target);
  git(target.absolutePath, ['add', '--', ...destinations]);

  const staged = git(target.absolutePath, ['diff', '--cached', '--name-only']).trim();
  if (!staged) {
    console.log(`[ai-sync] ${target.name}: không có thay đổi, không commit.`);
    return;
  }

  const sourceCommit = getSourceCommit();
  const commitMessage = `${config.git.commitMessage}\n\nSource: ${getSourceRepoName()}@${sourceCommit}`;
  git(target.absolutePath, [
    '-c',
    `user.name=${config.git.authorName}`,
    '-c',
    `user.email=${config.git.authorEmail}`,
    'commit',
    '-m',
    commitMessage,
  ]);

  if (config.git.pushMode === PUSH_MODE_DIRECT) {
    git(target.absolutePath, ['push', 'origin', `HEAD:refs/heads/${target.branch}`], { stdio: 'inherit' });
    console.log(`[ai-sync] ${target.name}: đã push thẳng lên ${target.branch}`);
    return;
  }

  // Branch sync do bot quản lý: luôn được tạo lại từ branch gốc mới nhất nên cần force push.
  git(target.absolutePath, ['push', '--force', 'origin', `HEAD:refs/heads/${config.git.syncBranch}`], {
    stdio: 'inherit',
  });
  await ensurePullRequest(config, target, staged.split('\n'), sourceCommit);
}

function collectDestinations(config, target) {
  const destinations = [];
  for (const mapping of config.mappings) {
    if (!isMappingEnabledForTarget(mapping, target)) {
      continue;
    }
    if (fs.existsSync(path.join(target.absolutePath, mapping.to))) {
      destinations.push(mapping.to);
    }
  }
  return destinations;
}

async function ensurePullRequest(config, target, changedFiles, sourceCommit) {
  const token = process.env.AI_SYNC_TOKEN || process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  if (!token || !target.repoFullName) {
    console.warn(`[ai-sync] ${target.name}: không có token / repo name, bỏ qua bước tạo PR`);
    return;
  }
  const owner = target.repoFullName.split('/')[0];
  const query = `head=${encodeURIComponent(`${owner}:${config.git.syncBranch}`)}&base=${encodeURIComponent(target.branch)}&state=open`;
  const openPulls = await githubRequest(token, 'GET', `/repos/${target.repoFullName}/pulls?${query}`);
  if (openPulls.length > 0) {
    console.log(`[ai-sync] ${target.name}: PR đã tồn tại, đã cập nhật: ${openPulls[0].html_url}`);
    return;
  }

  const fileList = changedFiles.map(function formatFile(file) {
    return `- \`${file}\``;
  });
  const body = [
    `Tự động đồng bộ skill / instruction / config AI từ \`${getSourceRepoName()}@${sourceCommit}\`.`,
    '',
    'Quy tắc: chỉ thêm mới hoặc ghi đè file trùng tên, không xoá file riêng của dự án.',
    '',
    '### File thay đổi',
    ...fileList,
  ].join('\n');

  const pull = await githubRequest(token, 'POST', `/repos/${target.repoFullName}/pulls`, {
    title: config.git.commitMessage,
    head: config.git.syncBranch,
    base: target.branch,
    body: body,
  });
  console.log(`[ai-sync] ${target.name}: đã tạo PR ${pull.html_url}`);
}

async function githubRequest(token, method, apiPath, body) {
  const response = await fetch(`https://api.github.com${apiPath}`, {
    method: method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'ai-skill-sync',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`GitHub API ${method} ${apiPath} lỗi ${response.status}: ${text}`);
  }
  return text ? JSON.parse(text) : null;
}

function getSourceCommit() {
  try {
    return git(ROOT_DIR, ['rev-parse', '--short', 'HEAD']).trim();
  } catch (error) {
    return 'unknown';
  }
}

function getSourceRepoName() {
  if (process.env.GITHUB_REPOSITORY) {
    return process.env.GITHUB_REPOSITORY;
  }
  return path.basename(ROOT_DIR);
}

function git(cwd, gitArgs, options) {
  const execOptions = Object.assign({ cwd: cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }, options || {});
  const output = execFileSync('git', gitArgs, execOptions);
  return output || '';
}
