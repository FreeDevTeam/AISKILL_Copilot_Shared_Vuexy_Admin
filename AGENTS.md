# AGENTS.md — AISKILL_Copilot_Shared_Vuexy_Admin

Repo này là **nguồn chung (single source of truth)** cho skill / instruction / file config AI của các dự án Admin Website (Vuexy React).
Nội dung được script `scripts/sync-ai-config.js` đồng bộ sang các repo dự án (submodule trong `projects/`).

## Cấu trúc

| Đường dẫn | Vai trò |
|---|---|
| `.copilot/instructions/` | Instruction dùng chung (`*.instructions.md`). Quy tắc viết: `.copilot/instructions/README.MD` |
| `.copilot/skills/<skill-name>/SKILL.md` | Skill dùng chung. Quy tắc viết: `.copilot/skills/README.MD` |
| `templates/` | File config agent sẽ được copy sang repo dự án (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`, `.cursor/rules/`, `.vscode/settings.json`) |
| `ai-sync.config.json` | Danh sách target + mapping copy |
| `scripts/sync-ai-config.js` | Script checkout submodule + copy + commit/push/PR |
| `projects/` | Các repo dự án (git submodule). **Không sửa code dự án trong repo này.** |

## Quy tắc cho agent khi làm việc trong repo này

1. Khi viết / sửa skill hay instruction: đọc `.copilot/skills/README.MD` hoặc `.copilot/instructions/README.MD` trước và tuân thủ frontmatter bắt buộc (`name` trùng tên thư mục skill, `description` theo pattern "Use when...", `applyTo` hẹp).
2. Nội dung trong `.copilot/` phải dùng chung được cho mọi dự án; nội dung riêng của 1 dự án đặt trong repo dự án đó.
3. Đổi tên / xoá file trong `.copilot/` KHÔNG xoá file cũ ở repo dự án (script không bao giờ xoá) → cần dọn tay ở repo dự án nếu muốn.
4. Script không dùng dependency ngoài, chạy được với NodeJS >= 18.
