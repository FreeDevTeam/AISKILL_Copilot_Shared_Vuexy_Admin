# Cấu Trúc Manager

- Manager chỉ xử lý business logic, không tự build response HTTP thủ công.
- Layer route xử lý pre/validate và gọi response middleware.
- Mọi hàm public trong manager đều phải có try/catch.
- Với manager theo Promise, dùng `return resolve(...)`, `return reject(...)`, `return handleErrorResponse(...)` để dừng luồng thực thi rõ ràng.
- Hàm private/helper không dùng try/catch cục bộ nếu hàm public đã xử lý catch tập trung.
- Manager không trả object trạng thái như `success`, `errorCode`, `orderError`; chỉ return data khi thành công và `throw` mã lỗi để middleware xử lý.
- Với batch API trong manager, không trả output dư thừa (không trả endpoint, không tự bọc total/results nếu chưa có chuẩn chung).
- Helper chỉ chứa logic dùng chung, tránh gom quá nhiều trách nhiệm trong một helper.
- Không trùng lặp business logic giữa các endpoint.
