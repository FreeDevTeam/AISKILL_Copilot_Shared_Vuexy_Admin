---
name: add-new-thirdparty-api
description: "Use when integrating a new third-party API into a NodeJS project following clean architecture principles. Covers project structure analysis, file creation, function implementation, and integration logging. Trigger on keywords such as 'add third-party API', 'new payment gateway of partner', 'thêm cổng thanh toán của đối tác'. MANDATORY: always load and apply the coding-convention skill before implementing any code change."
---

# Add New Third-Party API

## When to Use

- tích hợp API mới của đối tác khác / nền tảng khác vào dự án

## Procedure

1. Tạo 1 folder mới trong folder ThirdParty. (không phải API/Thirdparty). Tên folder đặt theo loại và tên đối tác hoặc nền tảng cung cấp API, ví dụ: PaymentGatewayVNPAYQR, PaymentGatewayMOMO..v..v
2. Tách các API gốc của nền tảng đối tác vào thành file JS riêng. Ví dụ nếu là cổng thanh toán sẽ có file như PaymentGatewayVNPAYQRAPI.js
3. Tạo file Function để implement các function nếu cần thiết. Thường là cần xử lý data đầu vào hoặc gọi nhiều API cho 1 tác vụ cụ thể thì mới cần file Function riêng, còn nếu chỉ đơn giản là gọi API gốc rồi trả về kết quả thì có thể không cần file Function mà chỉ export trực tiếp từ file API.

## Deliverables

- Thirdparty API module: file JS chứa các function gọi API gốc của đối tác, có thể có thêm file Function nếu cần thiết để xử lý logic riêng.

## Review Checklist

- review theo coding-convention của dự án