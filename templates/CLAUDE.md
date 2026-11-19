## Shared AI skills & instructions (Claude Code)

Đọc và tuân thủ @AGENTS.md (phần "Shared AI skills & instructions").

- Instruction dùng chung: `.copilot/instructions/*.instructions.md` — luôn kiểm tra `applyTo` / `description` trong frontmatter để biết file nào phải áp dụng cho file đang sửa.
- Skill dùng chung: `.copilot/skills/<skill-name>/SKILL.md` (bản sao cho Claude Code tự nhận diện nằm ở `.claude/skills/`). Khi task khớp `description` của skill, đọc `SKILL.md` + `references/` rồi làm theo.
- Skill `coding-convention` (nếu có) phải được đọc trước khi sửa code.
