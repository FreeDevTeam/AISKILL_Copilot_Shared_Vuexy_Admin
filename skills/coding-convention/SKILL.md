---
name: coding-convention
description: "Use for every code change in this repository: create/update/refactor/fix APIs, managers, routes, services, tests. Always load this skill first before editing code to enforce naming, structure, logging, validation, and minimal-safe changes. Trigger keywords: coding convention, convention, style, refactor, clean code, maintainability, consistency, chuẩn code, coding-convention."
---

# Quy Ước Coding

## Quy Tắc Bắt Buộc

- Luôn đọc skill này trước khi chỉnh sửa code trong repository.
- Format code theo chuẩn Prettier đã được lưu sẵn trong .prettierrc của dự án
- Dùng function declaration, không arrow cho named function.

## Quy Tắc Cốt Lõi
- Việc gọi hàm phải được gọi rõ ràng, tuyệt đối không được gọi hàm gián tiếp thông qua biến, object, array, hoặc bất kỳ cách nào khác. Ví dụ: `const func = myFunction; func();` là không được phép.
- Chỉ sửa trong phạm vi yêu cầu, thay đổi tối thiểu và an toàn.
- Ưu tiên tái sử dụng logic ở manager/service hiện có, tránh trùng lặp nghiệp vụ.
- Giữ layer route gọn nhẹ; toàn bộ nghiệp vụ đặt trong manager/functions.
- Validate input sớm và trả response theo đúng schema chung của hệ thống.
- Giữ nguyên contract code/message và constants hiện có khi không bắt buộc phải đổi.
- Đặt tên theo đúng pattern của module hiện tại để đảm bảo nhất quán.
- Chỉ thêm comment khi logic khó hiểu, không thêm comment mô tả điều hiển nhiên.

### đối với String
- phải định nghĩa Constant trong file hoặc dùng constant (nếu có sẵn). không trực tiếp đưa string vào sử dụng. ví dụ: `const stationCode = StationConstant.DEFAULT_STATION_CODE;` thay vì `const stationCode = 'stationCode';`.
- Ngoại lệ: các string mang tính cấu hình khai báo tại chỗ và chỉ phục vụ framework/router/schema như `method`, `path`, `tags`, `description`, `handler`, Joi `.valid('asc', 'desc')`, key field trong schema, hoặc tên route config thì được phép viết trực tiếp tại nơi khai báo để dễ đọc và dễ kiểm soát luồng route. Không tách các string này vào file constants nếu việc đó làm code phải nhảy tham chiếu nhiều nơi và khó theo dõi.

### đối với Constant
- Constant phải định nghĩa trong file constants riêng theo module (ví dụ: OrderConstant.js) để tiện tái sử dụng, không hardcode trong function, manager hoặc route. Nếu chỉ sử dụng bên trong 1 file thì có thể định nghĩa constant trong file đó, nhưng vẫn phải đặt ở đầu file và nhớ kiểm tra trùng lặp.
- Tên Constant phải gồm tối thiểu 3 từ để đảm bảo rõ nghĩa, giảm trùng lặp và dễ tìm kiếm. Ví dụ: `const DEFAULT_STATION_CODE = 'stationCode';` thay vì `const STATION_CODE = 'stationCode';`.

### đối với query database
- Không query database trực tiếp bằng library. Luôn query thông qua ResourceAccess để đảm bảo tái sử dụng, cache, và dễ maintain.
- Không tự ý thêm hàm trong resourceAccess. Chỉ Khi cần thiết cache cho việc tìm 1 record, hãy tạo hàm mới trong resourceAccess để tái sử dụng. Ví dụ: `findOneByStationCode(stationCode)` thay vì `find({ stationCode: stationCode }, 0, 1)`. Tham khảo hàm `findById` để tạo hàm mới tương tự, vì `findById` cũng chỉ lấy 1 record theo 1 field duy nhất là primary key. Nếu hàm đã tồn tại thì nên tái sử dụng.
- thay vì logic != (tìm khác biệt) thì hãy dùng logic tìm các giá trị cụ thể được chấp nhận trong constant. Vì các logic này thường áp dụng cho bộ lọc theo constant sẵn có (cố định và giới hạn số lượng giá trị). Ví dụ: thay vì `find({ feedbackStatus: { $ne: TAX_CDS_TAX_PARTNER_FEEDBACK_STATUS.COMPLETED } })` thì hãy dùng `find({ feedbackStatus: { $in: [TAX_CDS_TAX_PARTNER_FEEDBACK_STATUS.PENDING, TAX_CDS_TAX_PARTNER_FEEDBACK_STATUS.REJECTED] } })`. Logic này giúp tránh việc bỏ sót các giá trị mới được thêm vào constant trong tương lai.

### đối với response data của các API trong manager
- tuân thủ các field data (data có thể bất kỳ định dạng gì), total (số lượng), totalNextPage (số lượng ở trang kế tiếp)

## Một số best practice phải tuân thủ:
- đối với các loại dữ liệu JSON như object, array, khi sử dụng phải đầy đủ field và value. 
Ví dụ: { stationCode: stationCode } thay vì { stationCode }.
- đối với truy cập dữ liệu từ database (ResourceAccess, ví dụ StationsResourceAccess), nếu chỉ cần lấy 1 record theo 1 field duy nhất (không phải primary key) thì xem xét tạo thêm 1 hàm mới trong ResourceAccess để tối ưu sử dụng và cache. Ví dụ: findOneByStationCode(stationCode) thay vì find({ stationCode: stationCode }, 0, 1), logic tham khảo findById để thực hiện tương tự vì findById cũng chỉ lấy 1 record theo 1 field duy nhất là primary key. Lưu ý: nếu hàm đã tồn tại thì nên tái sử dụng.

## Checklist Trước Khi Hoàn Thành

- Không trùng lặp business logic giữa các endpoint.
- Không refactor ngoài phạm vi các file liên quan trực tiếp.
- Handler mới phải được export đầy đủ và khai báo route đúng.
- Đã kiểm tra lỗi lint/compile sau khi thay đổi.
- Không validate trùng các lỗi mà Joi middleware ở route đã xử lý.
- 
- Các helper/snippet dùng chung cần tách và tái sử dụng hợp lý: đưa vào ApiUtils, utilFunctions.js hoặc file chuyên biệt theo mục đích.
- Helper dùng chung phải thuần JavaScript, không chứa logic đặc thù module, không gọi database, không gọi API ngoài, không gọi chức năng đối tác (folder ThirdParty) và không phụ thuộc module khác.

## Tài Liệu Tham Chiếu

- Quy ước cách code cho manager: ./references/manager-structure.md
- Quy ước định nghĩa mã lỗi: ./references/error-code-definition.md
- Quy ước route và validate: ./references/route-validation.md
- Quy ước log API Partner: ./references/partner-api-logging.md
