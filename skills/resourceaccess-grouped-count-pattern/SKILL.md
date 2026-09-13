---
name: resourceaccess-grouped-count-pattern
description: "Use for grouped statistics in ResourceAccess. Flow: distinct rows -> grouped counts -> merge by one id field."
---

# ResourceAccess Grouped Count Pattern

## Dùng khi
- Cần group-by nhiều metric theo cùng một id.
- Cần paging theo danh sách id distinct.

## Flow
1. `findDistinct...`: lấy `id` + metadata theo `skip/limit`.
2. count từng metric theo cùng `id`.
3. Merge theo map và trả theo thứ tự distinct rows.

## Liên quan
- Query rules chung: `.github/skills/resourceaccess-query-basics/SKILL.md`
