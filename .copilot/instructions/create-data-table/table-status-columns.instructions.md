---
description: "Use when implementing status columns, status badges, status colors, or STATUS_BADGES constants in tables."
---

# Table Status Columns

1. Cột trạng thái phải sử dụng component `BasicTextBadge` với màu tương ứng cho từng trạng thái.

2. Định nghĩa toàn bộ thông tin trạng thái gồm tên, giá trị và màu sắc trong `constants/badge.js`, sau đó import vào file sử dụng.

3. Kiểm tra và tái sử dụng trạng thái đã có trước khi định nghĩa trạng thái mới.

4. Đăng ký mọi trạng thái làm property của `STATUS_BADGES`. Không tạo thêm constant trạng thái khác và sắp xếp các property theo thứ tự alphabet (A-Z).

5. Chọn màu theo theme hiện có, ví dụ: `light-success`.

6. Tách logic switch trạng thái thành hàm riêng; không đặt switch trực tiếp trong code UI.