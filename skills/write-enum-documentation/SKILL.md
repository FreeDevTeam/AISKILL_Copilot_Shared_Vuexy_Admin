---
name: write-enum-documentation
description: "Generate enum tables from backend constants for API docs (Markdown + HTML). Ensure completeness and correct values."
---

# Kỹ năng: Viết Bảng Enum cho Tài Liệu

Hướng dẫn tạo enum tables từ backend constants, định dạng cho Markdown và HTML.

## Khi nào dùng

- ✅ Tạo enum table cho trạng thái, loại, màu sắc, ... 
- ✅ Extract enum với tất cả values từ backend constants file
- ✅ Định dạng enum vào Markdown/HTML doc
- ✅ Verify enum completeness so sánh backend
- Tạo bảng enum từ backend constants
- Đảm bảo đầy đủ và đúng giá trị
- Output: Markdown + HTML

## Nguyên tắc

### 1. Source of truth
- Luôn lấy từ backend constants
- Không tự suy đoán value

### 2. Đảm bảo đầy đủ
- Enum trong doc phải match 100% backend
- Không thiếu / không dư

### 3. Format

#### Markdown
- 2 cột: Giá trị | Mô tả
- Không dấu `.` cuối câu

#### HTML
- `<table>` format
- Mô tả bắt buộc có dấu `.`

### 4. Consistency
- Markdown và HTML phải giống nhau về value
- Sắp xếp theo thứ tự (numeric/alphabetical)