---
name: resourceaccess-query-basics
description: "Use for general ResourceAccess query conventions: filter, paging, sorting, count, and safe defaults."
---

# ResourceAccess Query Basics

## Rule cốt lõi
- Query qua ResourceAccess, không query DB trực tiếp ở manager.
- Tận dụng `_makeQueryBuilderByFilter` + `Common.filterHandler`.
- Tránh `DB.raw` nếu query builder làm được.
- nên xem trong CommonResourceAccess để tận dụng các hàm sẵn có

## Data mapping
- Dùng một field id nhất quán trong toàn flow.
- `||` chỉ để default (`0`, `''`, `[]`).
- Không fallback nhiều biến cho cùng ý nghĩa id.