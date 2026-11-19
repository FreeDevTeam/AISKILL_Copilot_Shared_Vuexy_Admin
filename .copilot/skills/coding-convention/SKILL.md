---
name: coding-convention
description: "Use when implementing a new code or update existing code"
---

# Coding Convention

## Common Convention
- dùng IF rõ ràng thay cho toán tử 3 ngôi, trừ khi code quá ngắn
- dùng switch case thay cho nhiều if else, trừ khi if quá ít (dưới 5)

## Text

- Tất cả text hiển thị phải được chuẩn hoá hỗ trợ đa ngôn ngữ. Sử dụng intl.formatMessage . tên của message nên đặt theo dạng: <tên module>.<tên component>.<tên biến>. Ví dụ: warning.list.title, warning.list.column.plateNumber, warning.list.column.crimeRecordContent. và nên theo thứ tự alphabet (A-Z) để dễ tìm kiếm.
- Kích thước, style text thì tuân thủ theo /src/views/ui-elements/typography/index.js, không nên hardcode trực tiếp trong component. Nếu text nằm trong widget / card thì tuân thủ theo src/views/ui-elements/cards. (nếu không chỉ định hoặc không có thì dùng src/views/ui-elements/card/statistic vì thông thường widget / card sẽ sử dụng cho dashboard nên chỉ dùng kiểu này).
- Icon chỉ được dùng có sẵn trong src/views/ui-elements/icons/index.js, không nên hardcode trực tiếp trong component.

## String
- phải định nghĩa constant cho string được dùng làm param, enum, key. Riêng intl thì không cần.
- constant của component thì nên đi theo component. ko nên định nghĩa ở nơi khác
- nếu hiển thị là Số (Number) thì phải format để hiển thị thống nhất, sử dụng formatDisplayNumber


## Components UI
1. khi tạo component thì tên file js và tên scss phải trùng với tên Components UI luôn.

### Widget / Card Component
1. Tạo component và đặt tên file WidgetXXX.js để trong /src/views/components/customWidgets/ để sử dụng lại trong nhiều nơi, đặc biệt là dashboard.
2. Khi tạo widget / card thì tuân thủ theo src/views/ui-elements/cards. nếu không chỉ định hoặc không có thì dùng src/views/ui-elements/card/statistic vì thông thường widget / card sẽ sử dụng cho dashboard.
3. Layout các card / widget trên 1 trang / 1 panel thì tuân thủ theo src/views/ui-elements/page-layouts/BoxedLayout.js
4. Đối với các Widget / Card thì nên có Action riêng để gọi API (lấy dữ liệu), thực hiện loading sử dụng Colored Spinners và cache lại kết quả trong 5 phút. Lưu ý là cache kết quả của Action, không phải cache của API vì mỗi lần thao tác có khả năng bộ lọc dữ liệu sẽ khác, lúc đó cần lấy lại dữ liệu từ API cho đúng.

## Rules

1. các cột phải lựa chọn dùng Width phù hợp trong COLUMNS_WIDTH
2. các cell nên lựa chọn sử dụng component cho phù hợp trong views/components

## Color 
- Sử dụng màu sắc phải tuân theo thiết kế trong ./src/views/ui-elements/colors/DefaultColors.js
- Không nên hardcode màu trực tiếp trong component.