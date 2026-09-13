---
name: implement-callback-model
description: "Create/implement model file for webhook callbacks. Follows pattern: filter allowed fields, hide internal IDs, validate with Joi. Includes discovering backend schema and selecting correct fields. Trigger on: 'tạo model webhook', 'implement callback model', 'model file callback'."
---

# Kỹ năng: Tạo Model File cho Webhook Callback

Hướng dẫn tạo model file để xác định dữ liệu nào được phép gửi đến đối tác qua webhook callback.

## Khi nào dùng

- ✅ Tạo file `API/StationWebHooks/model/CallbackXxxModel.js` mới
- ✅ Quyết định fields nào hidden, fields nào exposed
- ✅ Thêm comment giải thích tại sao hide các internal IDs

## Mục tiêu
- Lọc dữ liệu trả về cho partner qua webhook
- Ẩn internal fields
- Validate bằng Joi

## Nguyên tắc

### 1. Chỉ expose:
- Primary key
- Business fields
- partnerName, partnerTranID
- projectName
- createdAt, updatedAt

### 2. Luôn ẩn:
- Internal IDs (customerId, appUserId...)
- Internal flags (isDeleted...)
- Audit nội bộ (createdBy...)

### 3. Implementation
- Dùng ALLOWED_FIELDS, HIDDEN_FIELDS để filter
- parseModel: lọc field
- validateModel: Joi validate
- Sử dụng các function của CallbackModelCommon để tránh duplicate code