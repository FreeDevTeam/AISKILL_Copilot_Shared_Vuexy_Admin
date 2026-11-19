## Shared AI skills & instructions (GitHub Copilot)

Repo này dùng bộ skill / instruction dùng chung đặt trong `.copilot/` (đồng bộ tự động từ repo shared). Xem chi tiết quy trình trong `AGENTS.md`.

- Instruction: `.copilot/instructions/*.instructions.md`. Với mỗi file đang sửa, áp dụng mọi instruction có `applyTo` khớp; đọc thêm instruction có `description` khớp task.
- Skill: `.copilot/skills/<skill-name>/SKILL.md`. Khi task khớp `description` của skill, đọc `SKILL.md` + các file `references/` rồi làm theo.
- Skill `coding-convention` (nếu có) phải được load trước mọi thay đổi code.
- Instruction / skill riêng của dự án (`.github/instructions/`, `.github/skills/`) được ưu tiên hơn bộ shared nếu mâu thuẫn.
- VS Code: `.vscode/settings.json` đã khai báo `.copilot/instructions` và `.copilot/skills` để Copilot tự load.
