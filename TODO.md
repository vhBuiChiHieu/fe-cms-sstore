# TODO List cho dự án CMS S-Store

## Đã hoàn thành

- [x] Tạo khung giao diện chính với Material UI
- [x] Tạo trang Dashboard với các thẻ tóm tắt và biểu đồ
- [x] Tạo trang đăng nhập (Login) với xác thực email và mật khẩu
- [x] Thiết lập hệ thống xác thực (AuthContext)
- [x] Bảo vệ các route yêu cầu đăng nhập (ProtectedRoute)
- [x] Thêm chức năng đăng xuất
- [x] Tạo biến BASE_URL trong utils/config.ts để sử dụng cho các API call
- [x] Cập nhật chức năng đăng nhập để gọi API và lưu token
- [x] Tạo trang 404 Not Found
- [x] Sửa lỗi đăng nhập không chuyển hướng đến dashboard
- [x] Thêm chức năng thu gọn menu trong layout
- [x] Đổi menu "Khách hàng" thành "Người dùng" với menu con "Tài khoản" và "Thông tin cá nhân"
- [x] Tạo trang quản lý tài khoản người dùng với chức năng xem danh sách, tìm kiếm và lọc
- [x] Sửa lỗi hiển thị trang quản lý tài khoản (accounts is undefined)
- [x] Sửa lỗi ESLint về import không sử dụng trong các components

## Cần làm

- [ ] Hoàn thiện trang quản lý người dùng
  - [ ] Thêm chức năng tạo tài khoản mới
  - [ ] Thêm chức năng chỉnh sửa tài khoản
  - [ ] Thêm chức năng khóa/mở khóa tài khoản
  - [ ] Thêm chức năng xóa tài khoản
  - [ ] Tạo trang thông tin cá nhân người dùng

- [ ] Tạo trang quản lý sản phẩm
  - [ ] Danh sách sản phẩm
  - [ ] Thêm/Sửa/Xóa sản phẩm
  - [ ] Tìm kiếm và lọc sản phẩm

- [ ] Tạo trang quản lý đơn hàng
  - [ ] Danh sách đơn hàng
  - [ ] Chi tiết đơn hàng
  - [ ] Cập nhật trạng thái đơn hàng

- [ ] Tạo trang báo cáo
  - [ ] Báo cáo doanh thu
  - [ ] Báo cáo sản phẩm bán chạy
  - [ ] Báo cáo người dùng tiềm năng

- [ ] Tạo trang cài đặt
  - [ ] Thông tin cửa hàng
  - [ ] Quản lý người dùng
  - [ ] Cài đặt hệ thống

- [ ] Kết nối với API backend
  - [x] Xác thực người dùng
  - [x] Lấy danh sách tài khoản
  - [ ] Lấy và cập nhật dữ liệu khác

- [ ] Tối ưu hóa hiệu suất
  - [ ] Lazy loading các component
  - [ ] Memoization để tránh render không cần thiết

- [ ] Kiểm thử
  - [ ] Viết unit tests
  - [ ] Kiểm thử tích hợp

- [ ] Triển khai
  - [ ] Build ứng dụng
  - [ ] Triển khai lên môi trường production

## Ghi chú

- Ưu tiên hoàn thiện các chức năng cơ bản trước
- Đảm bảo giao diện responsive trên các thiết bị
- Tuân thủ các nguyên tắc SOLID và DRY trong quá trình phát triển
