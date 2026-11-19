---
description: "Use when choosing COLUMNS_WIDTH values or alignment for DataTable and BasicTablePaging columns."
---

# Table Column Layout

## Column Width

Khi một cột hiển thị riêng một field, ưu tiên các độ rộng phổ biến sau:

| Field | Width |
|---|---|
| `username` | `COLUMNS_WIDTH.LARGE` |
| `email` | `COLUMNS_WIDTH.NORMAL` |
| `phone` | `COLUMNS_WIDTH.NORMAL` |
| `companyName` | `COLUMNS_WIDTH.NORMAL` |
| `createdAt` | `COLUMNS_WIDTH.NORMAL` |
| Ngày và giờ | `COLUMNS_WIDTH.NORMAL` |

## Column Alignment

Các cột sau phải có `center: true`:

- `STT`
- `createdAt`
- Cột hành động
- Cột trạng thái hiển thị dạng badge
- Cột mã hoặc loại có giá trị không dài hơn 40 ký tự, ví dụ: số điện thoại, số CMND/CCCD, số hợp đồng, số hóa đơn, số phiếu thu