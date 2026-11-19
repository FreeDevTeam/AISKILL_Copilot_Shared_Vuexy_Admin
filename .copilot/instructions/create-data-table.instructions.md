---
description: "Use when implementing or editing table columns or cells (DataTable, BasicTablePaging, column renderItem) on any page."
---

# Data Table Instructions

Đọc các instruction chi tiết phù hợp với phần đang triển khai:

- Cell renderer và component hiển thị: [table-cell-components.instructions.md](./create-data-table/table-cell-components.instructions.md)
- Thứ tự cột và cột hành động: [table-column-order-and-actions.instructions.md](./create-data-table/table-column-order-and-actions.instructions.md)
- Độ rộng và căn chỉnh cột: [table-column-layout.instructions.md](./create-data-table/table-column-layout.instructions.md)
- Cột trạng thái và badge: [table-status-columns.instructions.md](./create-data-table/table-status-columns.instructions.md)
- Tiêu đề cột: [table-headers.instructions.md](./create-data-table/table-headers.instructions.md)

Khi tạo mới hoặc chỉnh sửa cấu hình của toàn bộ bảng, phải đọc và áp dụng tất cả các file trên. Khi chỉ chỉnh sửa một thành phần cụ thể, đọc file tương ứng và các file có liên quan trực tiếp.

1. Cột đầu tiên luôn luôn là "STT" (Số thứ tự). Cột này do frontend quản lý, tăng dần từ trên xuống và paging. Các bảng cũ hay có cột ID ở đầu tiên, không cần cột ID này nữa. 
2. username thì luôn sử dụng component `BasicTextHyperlink` để mở về trang chi tiết của người dùng (nếu có id) tại `/user/form-user?appUserId=${encryptIdToHash(detailOrder?.appUserId)}` . thao tác mở link là redirect chứ không mở trang mới.
3. Một số use-case sử dụng COLUMNS_WIDTH phổ biến áp dụng khi các cột hiển thị giá trị riêng lẻ theo từng field:
username: COLUMNS_WIDTH.LARGE
email: COLUMNS_WIDTH.NORMAL
phone: COLUMNS_WIDTH.NORMAL
companyName: COLUMNS_WIDTH.NORMAL
createdAt: COLUMNS_WIDTH.NORMAL
các cột hiển thị thời gian gồm ngày và giờ: COLUMNS_WIDTH.NORMAL

4. Các cột hiển thị trạng thái (status) nên sử dụng component `BasicTextBadge` để hiển thị với màu sắc tương ứng với từng trạng thái.
- định nghĩa toàn bộ status (tên, giá trị, màu sắc) trong constants/badge.js và import vào file cần sử dụng. 
- Lưu ý: nên tham khảo các status đã có sẵn trước khi định nghĩa mới. 
- tất cả đều đăng ký vào làm các property của STATUS_BADGES. không định nghĩa thêm constant khác. và phải định nghĩa theo thứ tự alphabet (A-Z). 
- Màu sắc thì tham khảo Theme (Ví dụ: "light-success" ). 
- Lưu ý: việc switch trạng thái phải tách hàm riêng, không để trực tiếp bên trong code JS UI.

5. cột createdAt luôn luôn để ở cuối cùng của bảng trước cột "Hành động" (nếu có), bất kể các cột khác được sắp xếp như thế nào.

6. cột cuối cùng luôn luôn là hành động BasicTableDataActions. Chỉ Khi không có hành động gì thì để 1 hành động là "Sao chép" để sao chép row data sang clipboard.

7. Các cột phải có "center:true":
- createdAt
- action
- STT
- status (các cột dạng BadgeStatus,trạng thái)
- các cột dạng mã / loại: số điện thoại, số CMND/CCCD, số hợp đồng, số hóa đơn, số phiếu thu. nếu không dài hơn 40 ký tự.


# Table Header
1. Tất cả các cột trong bảng đều phải có header (title) hiển thị. Không được để trống title của cột.
2. header text align mặc định luôn là center.