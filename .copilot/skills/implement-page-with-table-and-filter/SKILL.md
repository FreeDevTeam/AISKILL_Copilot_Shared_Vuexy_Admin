---
name: implement-page-with-table-and-filter
description: "Use when implementing a new page with a table and filter. Trigger on keywords such as 'add table page', 'new page with filter', 'thêm trang với bảng và bộ lọc'. MANDATORY: always load and apply the coding-convention skill before implementing any code change."
---

# Add new page with table and filter

## When to Use

- tạo mới 1 trang hoặc sửa các trang với bảng dữ liệu và bộ lọc, ví dụ: trang danh sách cảnh báo vi phạm giao thông, trang danh sách đơn hàng, trang danh sách sản phẩm, trang danh sách khách hàng, v.v.

## Rules
1. các cell nên lựa chọn sử dụng component cho phù hợp trong views/components

### Statistics Cards
Nếu có sửa đổi các widget hiển thị thông số thống kê:
1. Sử dụng component `StatsCard` để hiển thị các thông số thống kê phía trên các bảng nếu muốn hiển thị đồng thời các thông số chung 1 section. hoặc dùng `CustomStatsCard` cho từng thông số riêng lẻ.

#### Data Table 
Nếu có sửa đổi bảng dữ liệu:
1. Sử dụng component `BasicDataTable` để hiển thị danh sách dữ liệu.
2. Tham khảo các nguyên tắc trong create-data-table.instructions.md để đảm bảo tính nhất quán và hiệu quả khi hiển thị dữ liệu.