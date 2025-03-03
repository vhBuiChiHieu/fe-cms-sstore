# TODO List cho dự án CMS S-Store

## Đã hoàn thành
- [x] Tạo cấu trúc dự án cơ bản
- [x] Thiết lập các route cơ bản
- [x] Tạo trang đăng nhập
- [x] Tạo layout chính
- [x] Tạo trang dashboard
- [x] Tạo trang quản lý tài khoản người dùng với chức năng xem danh sách, tìm kiếm và lọc
- [x] Sửa lỗi hiển thị danh sách tài khoản (accounts is undefined)
- [x] Sửa lỗi ESLint về import không sử dụng trong các components
- [x] Cải thiện xử lý lỗi khi gọi API
- [x] Xử lý các trường hợp API trả về dữ liệu không đúng định dạng
- [x] Thêm xử lý cho trường hợp không có token xác thực
- [x] Cải thiện hiển thị thông báo lỗi
- [x] Thêm cột STT (số thứ tự) vào bảng danh sách tài khoản
- [x] Hiển thị số trang hiện tại trong phần phân trang
- [x] Tùy chỉnh phân trang với số trang hiển thị ở giữa các nút chuyển trang
- [x] Cập nhật ô chọn Vai trò để lấy dữ liệu từ API
- [x] Thêm chức năng xóa tài khoản với dialog xác nhận
- [x] Thêm chức năng khóa/mở khóa tài khoản
- [x] Cập nhật xử lý trạng thái tài khoản (status): 0 = Hoạt động, 1 = Chưa kích hoạt, 2 = Đã khóa
- [x] Tối ưu hóa hệ thống log với logger utility
- [x] Thêm menu con cho mục Sản phẩm (Loại Sản Phẩm, Biến Thể, Hãng, Danh mục)
- [x] Thêm menu con cho mục Đơn hàng (Giỏ Hàng, Đơn Hàng)
- [x] Sửa lỗi hiển thị dữ liệu mẫu khi gọi API thất bại, thay thế bằng thông báo lỗi
- [x] Sửa lỗi TypeScript trong AccountsPage.tsx và accountService.ts
- [x] Cải thiện xử lý xóa tài khoản với hiển thị thông tin tài khoản cần xóa
- [x] Cải thiện xử lý thay đổi trạng thái tài khoản với các hành động riêng biệt (khóa, mở khóa, kích hoạt)
- [x] Cải thiện hàm getAccounts để xử lý nhiều định dạng dữ liệu từ API khác nhau
- [x] Cải thiện hàm mapStatusToString để xử lý cả trường hợp status là số hoặc chuỗi
- [x] Cải thiện hàm getStatusLabel để hiển thị trạng thái với màu sắc phù hợp
- [x] Cải thiện hàm getRoleChip để hiển thị vai trò bằng tiếng Việt và màu sắc phù hợp
- [x] Sửa lỗi hiển thị thông báo lỗi khi API trả về mã lỗi 401 (Unauthorized)
- [x] Sửa lỗi kiểu dữ liệu trong EditAccountDialog (status và roles)
- [x] Thêm thuộc tính onAccountUpdated vào interface EditAccountDialogProps và cập nhật xử lý nút Submit
- [x] Cập nhật hàm getAccounts để xử lý đúng cấu trúc dữ liệu từ API mới
- [x] Sửa lỗi khi thay đổi số dòng hiển thị không cập nhật đúng pageSize trong API

## Đang thực hiện
- [ ] Hoàn thiện chức năng quản lý tài khoản
  - [ ] Tạo form thêm tài khoản mới
  - [ ] Tạo form chỉnh sửa tài khoản
  - [x] Xử lý khóa/mở khóa tài khoản
  - [x] Xử lý xóa tài khoản
- [ ] Tạo trang quản lý sản phẩm
- [ ] Tạo trang quản lý đơn hàng
- [ ] Tạo trang quản lý danh mục

## Cần thực hiện
- [ ] Phát triển các chức năng quản lý khác
  - [ ] Quản lý danh mục sản phẩm
  - [ ] Quản lý sản phẩm
  - [ ] Quản lý đơn hàng
  - [ ] Quản lý khách hàng
  - [ ] Quản lý khuyến mãi
  - [ ] Quản lý thanh toán
  - [ ] Quản lý vận chuyển
  - [ ] Quản lý kho hàng
  - [ ] Quản lý báo cáo và thống kê
- [ ] Phát triển các tính năng bổ sung
  - [ ] Hệ thống thông báo
  - [ ] Hệ thống nhắn tin nội bộ
  - [ ] Hệ thống quản lý tệp tin
  - [ ] Hệ thống quản lý nội dung
  - [ ] Hệ thống quản lý cấu hình
  - [ ] Hệ thống quản lý quyền truy cập
  - [ ] Hệ thống quản lý phiên bản
  - [ ] Hệ thống quản lý sao lưu và khôi phục

## Cần cải thiện
- [ ] Tối ưu hóa hiệu suất
- [ ] Thêm unit test và integration test
- [ ] Cải thiện giao diện người dùng
- [ ] Thêm validation cho các form
- [ ] Tạo hệ thống thông báo toàn cục
- [ ] Cải thiện hệ thống xác thực và phân quyền
- [ ] Tối ưu hóa SEO
- [ ] Tối ưu hóa trải nghiệm người dùng
- [ ] Tối ưu hóa tốc độ tải trang
- [ ] Tối ưu hóa kích thước bundle

## Triển khai
- [ ] Chuẩn bị môi trường triển khai
  - [ ] Cấu hình máy chủ
  - [ ] Cấu hình cơ sở dữ liệu
  - [ ] Cấu hình bảo mật
- [ ] Triển khai ứng dụng
  - [ ] Build ứng dụng
  - [ ] Triển khai lên môi trường production

## Ghi chú
- Ưu tiên hoàn thiện các chức năng cơ bản trước
- Cần kiểm tra kỹ lỗi và xử lý các trường hợp ngoại lệ
- Cần cải thiện trải nghiệm người dùng
