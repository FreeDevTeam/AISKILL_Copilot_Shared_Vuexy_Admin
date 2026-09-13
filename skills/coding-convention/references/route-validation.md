# Quy Ước Route Validation

- Tất cả endpoint phải có schema validate rõ ràng cho headers/payload.
- Giới hạn batch (min/max) phải đặt trong Joi schema tại route.
- Auth/permission phải cấu hình trong pre method theo CommonFunctions.
- Route không chứa business logic, chỉ dispatch về manager.
