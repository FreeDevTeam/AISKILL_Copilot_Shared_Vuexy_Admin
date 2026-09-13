# Quy Ước Định Nghĩa Mã Lỗi

- Mã lỗi phải được định nghĩa dưới dạng string CODE ONLY trong file constant.
- Không dùng function để tạo mã lỗi trong constant.
- Không hardcode mã lỗi trong manager hoặc route.
- Nếu hệ thống đã có mã lỗi dùng chung trong CommonConstant thì phải ưu tiên tái sử dụng, không định nghĩa trùng.
- Các lỗi validate payload đã do Joi middleware xử lý ở route thì không validate lại trong manager.
