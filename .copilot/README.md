# .copilot

Thư mục chứa bộ **skill** và **instruction** AI dùng chung cho các dự án Admin Website (Vuexy React).

```text
.copilot/
├── instructions/   # *.instructions.md — quy tắc / convention (xem instructions/README.MD)
└── skills/         # <skill-name>/SKILL.md — quy trình theo loại task (xem skills/README.MD)
```

Khi đồng bộ sang repo dự án (`scripts/sync-ai-config.js`):

- `.copilot/instructions/**` → `<repo>/.copilot/instructions/**`
- `.copilot/skills/**` → `<repo>/.copilot/skills/**` và `<repo>/.claude/skills/**` (để Claude Code tự nhận skill)
- Chỉ thêm mới / ghi đè file **trùng tên**, không xoá file riêng của dự án.
