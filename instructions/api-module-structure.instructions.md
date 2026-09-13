---
name: api-module-structure
description: "Standard structure for API modules in API/. Use when creating or refactoring modules to enforce consistent layering, naming, and request flow."
applyTo: "API/**/*.js"
---

# Kỹ năng: API Module Structure

## Mục tiêu
- Chuẩn hoá cấu trúc module API
- Tách rõ layer: route → manager → resourceAccess → services
- Đảm bảo naming và flow nhất quán

---

## 1. Core structure (bắt buộc)

- route/
  - index.js
  - <ModuleName>Route.js
- manager/<ModuleName>Manager.js
- resourceAccess/<ModuleName>ResourceAccess.js
- <ModuleName>Constants.js
- <ModuleName>Functions.js

---

## 2. Optional components

Chỉ thêm khi cần:
- services/
- cronjob/
- script/
- data/
- test/
- resourceAccess/*View.js, *Mapping.js

---

## 3. Request flow

1. route/index: define endpoint
2. Route: validate + auth + map action
3. Manager: business logic
4. ResourceAccess: DB
5. Services/Functions: reusable logic

---

## 4. Layer rules

- Route:
  - Không chứa business logic
- Manager:
  - Xử lý nghiệp vụ, permission, error
- ResourceAccess:
  - Chỉ query DB
- Services/Functions:
  - Logic tái sử dụng, không duplicate

---

## 5. Naming convention

- PascalCase theo ModuleName
- <ModuleName>Route / Manager / ResourceAccess / Services / Constants / Functions

---

## 6. Nguyên tắc quan trọng

- Không bypass Manager để gọi trực tiếp ResourceAccess từ Route
- Không đặt business logic trong Route
- Không duplicate logic giữa Manager và Services
- Cấu trúc các hàm, import phải tuân thủ thứ tự Route > Manager > Services > Functions > ResourceAccess > Constants.
- Không được import ngang hàng giữa các module khác nhau (ví dụ: Manager của Module A không được import Hàm của Manager trong Module B, nếu cần phải dùng chung thì đưa vào Services hoặc Functions của Module B và import vào Manager của Module A)