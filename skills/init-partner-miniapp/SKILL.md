---
name: init-partner-miniapp
description: "Dùng khi cấu hình hoặc bổ sung chức năng (icon miniapp) cho đối tác mới trên HomePage. Trigger keywords: thêm đối tác miniapp, cấu hình icon cho partner, init miniapp icon, cấu hình phạt nguội cho đối tác."
---

# Init Partner Miniapp

## Khi nào dùng skill này
- Bổ sung cấu hình hiển thị các chức năng (icon) miniapp (như tra cứu phạt nguội, điểm nóng vi phạm, nhận thông báo) cho một đối tác (partner) mới.

## Mandatory Inputs
Trước khi thực hiện, cần thu thập:
1. **Yêu cầu chức năng từ User:** Có thể là một đường link miniapp hoàn chỉnh, HOẶC chỉ là mô tả bằng ngôn ngữ tự nhiên (VD: "thêm phần nhận thông báo phạt nguội cho đối tác F88, ẩn khung nhập số điện thoại, truyền mã station").
2. **Tên đối tác (Partner Code):** (VD: `PREDEFINED_STATION_CODE_LIST.MYF88APP`).
3. **Danh sách tính năng cần cấu hình:** (VD: Tra cứu phạt nguội, Bản đồ điểm nóng, Nhận thông báo).

## Cấu trúc thư mục liên quan
- `API/HomePageConfig/HomePageConfigConstant.js` (Hằng số params)
- `API/HomePageConfig/data/ICON_PHAT_NGUOI_TAMOVE.js` (Cấu hình base icon)
- `API/HomePageConfig/data/defaultConfig/{TÊN_ĐỐI_TÁC}.js` (File config của đối tác)
- `API/HomePageConfig/scripts/initHomePageConfigForPartners.js` (Script thực thi)

## Workflow

### Bước 1 — Phân tích (Không viết code ngay)
- **Bóc tách params hoặc mô tả:** 
  - Nếu user quăng link: Tách các param (VD: `isEmbeddedView=true`, `appThemeName=F88`).
  - Nếu user chỉ mô tả bằng lời: AI có trách nhiệm tự động "phiên dịch" (mapping) mô tả đó sang các param tương ứng của hệ thống (VD: "ẩn khung số điện thoại" -> suy ra `showPhoneInput=false`, "bỏ phần giới thiệu" -> suy ra `isDisplayReferUserCode=false`).
- **Đối chiếu hằng số:** Kiểm tra `HomePageConfigConstant.js` xem đã có hằng số cho các param này chưa. Nếu chưa có, gom nhóm tạo mới (VD: `APP_THEME_NAME: { F88: 'F88' }`).
- **So sánh Path:** So sánh path yêu cầu với path của base icon (VD: user yêu cầu path `/introduce` trong khi base là `/vehicles`).
- **Dữ liệu động:** Tìm các biến động cần truy vấn như `stationsId`, `apiKey`. (Lấy `stationsId` bằng `StationsResourceAccess.findOneByStationCode`).

### Bước 2 — Xin xác nhận từ User (Wait for Approval)
- Trình bày tóm tắt các hằng số sẽ thêm.
- Đề xuất cách can thiệp URL (VD: dùng `.replace()` sửa path trong vòng lặp HOẶC đổi trực tiếp tham số ở base icon file).
- Xác nhận các giá trị (VD: Dùng true/false thay vì 1/0).
- Chờ user nói "OK".

### Bước 3 — Thực thi Code
Thực hiện tuần tự:
1. **Cập nhật Constant:** Thêm các hằng số mới vào `HomePageConfigConstant.js`.
2. **Cập nhật Base Icon:** Sửa file base (VD `ICON_PHAT_NGUOI_TAMOVE.js`) nếu được yêu cầu sửa thẳng.
3. **Tạo Default Config:** Tạo/Cập nhật file `API/HomePageConfig/data/defaultConfig/[TÊN_ĐỐI_TÁC].js` (import các icon tương ứng).
4. **Cập nhật Script:** Mở `initHomePageConfigForPartners.js`, thêm case cho đối tác:
   - Import đầy đủ (gồm `StationsResourceAccess` nếu cần ID).
   - Truy vấn `_station.stationsId` trước switch.
   - Thêm block `if (item.linkNavigation.indexOf(HOST_NAME...) !== -1)` cho từng icon.
   - Dùng `.replace()` cho path nếu cần thiết và cộng dồn các params URL bằng hằng số.

## Quality Checklist
- [ ] KHÔNG dùng 1/0 nếu dự án đang dùng true/false.
- [ ] Dù user chỉ mô tả bằng lời, AI vẫn phải mapping chuẩn xác ra các hằng số param của hệ thống.
- [ ] Constant nhóm biến có liên quan vào Object (như `APP_THEME_NAME`).
- [ ] Dùng template `{{varName}}` trong chuỗi hằng số, và replace động bằng `.replace('{{varName}}', value)` trong file script.
