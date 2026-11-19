---
description: "Use when implementing or editing table cell renderers, renderItem, or cell callbacks in DataTable and BasicTablePaging."
---

# Table Cell Components

1. Khi định nghĩa `renderItem` cho một cột trong bảng (`DataTable`, `BasicTablePaging`, v.v.), luôn ưu tiên tái sử dụng component `Basic*` đã có sẵn trong `src/views/components`, ví dụ: `BasicText`, `BasicLogoImage`, `BasicTextBadge`. Không viết JSX hoặc markup mới khi đã có component phù hợp.

2. Cell value phải lấy giá trị từ row và trả về JSX/component.

```jsx
cell: (row) => {
    const { title } = row
    return <BasicText text={title} />
}
```