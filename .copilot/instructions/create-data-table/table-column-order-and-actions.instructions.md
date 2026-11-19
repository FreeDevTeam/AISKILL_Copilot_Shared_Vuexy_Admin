---
description: "Use when defining table column order, index columns, createdAt placement, username links, or row actions."
---

# Table Column Order And Actions

1. Cột đầu tiên luôn là `STT` (Số thứ tự). Frontend quản lý giá trị này và tăng dần theo thứ tự từ trên xuống, có tính đến phân trang. Không dùng ID làm cột đầu tiên.

2. Cột `username` luôn dùng component `BasicTextHyperlink` để chuyển đến trang chi tiết người dùng khi có ID:

```jsx
`/user/form-user?appUserId=${encryptIdToHash(detailOrder?.appUserId)}`
```

Thao tác phải redirect trong cùng trang, không mở tab hoặc cửa sổ mới.

3. Cột `createdAt` luôn nằm cuối bảng, ngay trước cột `Hành động` nếu bảng có cột hành động.

4. Cột cuối cùng luôn là cột hành động sử dụng `BasicTableDataActions`. Nếu không có nghiệp vụ hành động nào khác, cung cấp hành động `Sao chép` để sao chép dữ liệu row vào clipboard.