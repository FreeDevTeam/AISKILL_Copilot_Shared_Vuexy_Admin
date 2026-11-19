## Shared AI skills & instructions

Repo này dùng bộ skill / instruction dùng chung, được đồng bộ tự động từ repo shared
`FreeDevTeam/AISKILL_Copilot_Shared_Vuexy_Admin`. Mọi AI agent (GitHub Copilot, Claude, Codex, Gemini, Cursor, ...) PHẢI tham chiếu 2 thư mục sau trước khi làm task:

| Thư mục | Nội dung | Cách dùng |
|---|---|---|
| `.copilot/instructions/` | Quy tắc / convention (`*.instructions.md`) | Đọc frontmatter `description` + `applyTo`. File có `applyTo` khớp với file đang sửa là BẮT BUỘC áp dụng. File khác đọc khi `description` khớp với task. |
| `.copilot/skills/<skill-name>/SKILL.md` | Quy trình chuẩn cho từng loại task | Khi task khớp `description` của skill: đọc `SKILL.md`, đọc thêm các file trong `references/` mà skill trỏ tới, rồi làm theo đúng quy trình. |

### Quy trình bắt buộc

1. Trước khi sửa code: liệt kê `.copilot/skills/` và `.copilot/instructions/`, chọn các skill / instruction liên quan tới task.
2. Skill `coding-convention` (nếu có) luôn được load trước mọi thay đổi code.
3. File có hậu tố `(only-read-when-needed)` chỉ đọc khi thật sự cần (ví dụ cần cấu trúc database).
4. Thay đổi tối thiểu, đúng phạm vi yêu cầu.

### Thứ tự ưu tiên khi mâu thuẫn

1. Yêu cầu trực tiếp của người dùng.
2. Skill / instruction riêng của dự án (ví dụ `.github/instructions/`, `.github/skills/`, `.copilot/**` có tên không trùng bộ shared, và phần nội dung nằm ngoài block AISKILL-SHARED).
3. Bộ shared trong `.copilot/`.

### Lưu ý khi chỉnh sửa skill / instruction

- File trong `.copilot/` có tên trùng với repo shared sẽ bị ghi đè ở lần đồng bộ tiếp theo. Muốn sửa chung cho mọi dự án → sửa ở repo shared.
- Skill / instruction riêng của dự án: đặt tên khác với bộ shared, sẽ không bị xoá hay ghi đè.
