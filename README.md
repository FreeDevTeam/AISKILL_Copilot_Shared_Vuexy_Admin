# AISKILL_Copilot_Shared_Vuexy_Admin

Nguồn chung cho **skill / instruction / file config AI** (GitHub Copilot, Claude Code, Codex, Gemini, Cursor) của các dự án Admin Website (Vuexy React),
kèm script + GitHub Actions để tự động đồng bộ sang từng repo dự án.

## Cấu trúc

```text
.
├── .copilot/
│   ├── instructions/            # instruction dùng chung (*.instructions.md)
│   └── skills/                  # skill dùng chung (<skill-name>/SKILL.md)
├── templates/                   # file config agent sẽ copy sang repo dự án
│   ├── AGENTS.md                #   → AGENTS.md                      (block)
│   ├── CLAUDE.md                #   → CLAUDE.md                      (block)
│   ├── GEMINI.md                #   → GEMINI.md                      (block)
│   ├── .github/copilot-instructions.md  → .github/copilot-instructions.md (block)
│   ├── .cursor/rules/aiskill-shared.mdc → .cursor/rules/aiskill-shared.mdc (overwrite)
│   └── .vscode/settings.json    #   → .vscode/settings.json          (json-merge)
├── projects/                    # repo dự án, add dạng git submodule
│   └── KiemDinhOto_AdminWebSite
├── scripts/sync-ai-config.js    # script đồng bộ
├── ai-sync.config.json          # danh sách target + mapping
├── .github/workflows/sync-ai-config.yml
├── AGENTS.md / CLAUDE.md / GEMINI.md / .github/copilot-instructions.md / .cursor/rules  # config agent cho chính repo này
└── .claude/skills -> ../.copilot/skills
```

## Quy tắc đồng bộ

Script **không bao giờ xoá file** ở repo dự án — mỗi repo vẫn có skill / instruction / config riêng.

| mode | Hành vi |
|---|---|
| `overwrite` | Tạo mới nếu chưa có, ghi đè nếu **trùng tên**. File khác giữ nguyên. |
| `block` | Chỉ thay phần giữa `<!-- BEGIN AISKILL-SHARED ... -->` và `<!-- END AISKILL-SHARED -->`. File chưa có marker → nối block vào cuối, nội dung riêng của dự án giữ nguyên. |
| `json-merge` | Deep merge key JSON: key của shared ghi đè key trùng, key riêng của dự án giữ nguyên. |

Muốn tắt 1 mapping cho 1 repo: thêm `"excludeMappings": [".claude/skills"]` (giá trị `to` của mapping) vào target trong `ai-sync.config.json`.

## Sử dụng script

Yêu cầu NodeJS >= 18, không cần `npm install`.

```bash
# Checkout source mới nhất của tất cả repo dự án + copy file (không commit)
node scripts/sync-ai-config.js

# Xem trước thay đổi
node scripts/sync-ai-config.js --dry-run

# Chỉ 1 repo
node scripts/sync-ai-config.js --target KiemDinhOto_AdminWebSite

# Commit + push lên branch chore/sync-ai-skills + tạo PR (cần AI_SYNC_TOKEN hoặc GH_TOKEN)
node scripts/sync-ai-config.js --push

# Add repo dự án mới (tạo submodule trong projects/ + đăng ký vào ai-sync.config.json)
node scripts/sync-ai-config.js add FreeDevTeam/<RepoName> --branch <branch>
```

Cấu hình push trong `ai-sync.config.json` → `git.pushMode`:

- `pr` (mặc định): push lên `git.syncBranch` (tạo lại từ branch gốc mới nhất mỗi lần, force push) và tạo PR nếu chưa có.
- `direct`: push thẳng lên branch gốc của repo dự án.
- `none`: chỉ copy, không commit.

## GitHub Actions

`.github/workflows/sync-ai-config.yml` chạy khi push lên `main` có thay đổi trong `.copilot/`, `templates/`, `scripts/`, `ai-sync.config.json`, `.gitmodules`,
hoặc chạy tay (workflow_dispatch, chọn target / dry run).

Cần tạo secret **`AI_SYNC_TOKEN`** (Settings → Secrets and variables → Actions): fine-grained PAT có quyền
`Contents: Read and write` + `Pull requests: Read and write` trên các repo dự án.

## Clone repo này

```bash
git clone https://github.com/FreeDevTeam/AISKILL_Copilot_Shared_Vuexy_Admin.git
cd AISKILL_Copilot_Shared_Vuexy_Admin
# Submodule chỉ cần khi muốn xem / chạy sync local:
git submodule update --init --depth 1
```
