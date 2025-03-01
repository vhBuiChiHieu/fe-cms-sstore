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

## Cần làm

- [ ] Tạo trang quản lý sản phẩm
  - [ ] Danh sách sản phẩm
  - [ ] Thêm/Sửa/Xóa sản phẩm
  - [ ] Tìm kiếm và lọc sản phẩm

- [ ] Tạo trang quản lý đơn hàng
  - [ ] Danh sách đơn hàng
  - [ ] Chi tiết đơn hàng
  - [ ] Cập nhật trạng thái đơn hàng

- [ ] Tạo trang quản lý khách hàng
  - [ ] Danh sách khách hàng
  - [ ] Thông tin chi tiết khách hàng
  - [ ] Lịch sử mua hàng của khách hàng

- [ ] Tạo trang báo cáo
  - [ ] Báo cáo doanh thu
  - [ ] Báo cáo sản phẩm bán chạy
  - [ ] Báo cáo khách hàng tiềm năng

- [ ] Tạo trang cài đặt
  - [ ] Thông tin cửa hàng
  - [ ] Quản lý người dùng
  - [ ] Cài đặt hệ thống

- [ ] Kết nối với API backend
  - [x] Xác thực người dùng
  - [ ] Lấy và cập nhật dữ liệu

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
