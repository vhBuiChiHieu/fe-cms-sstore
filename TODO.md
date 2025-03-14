# cSpell:disable
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
- [x] Thêm chức năng xem thông tin cá nhân từ avatar menu
- [x] Sửa lỗi cú pháp và TypeScript trong ProfileDialog.tsx
- [x] Cập nhật hiển thị avatar từ API khi trường avatar không null
- [x] Cải thiện bảo mật khi tải avatar bằng cách sử dụng token trong header thay vì URL
- [x] Sửa lỗi tải avatar trong MainLayout từ API /api/file/{avatarName}
- [x] Tạo trang danh mục sản phẩm với chức năng xem danh sách
- [x] Tạo service categoryService để gọi API danh mục
- [x] Thêm route cho trang danh mục sản phẩm
- [x] Cập nhật interface để phù hợp với dữ liệu API trả về
- [x] Thêm chức năng tạo danh mục mới
- [x] Cập nhật API phân trang danh mục sản phẩm với pageIndex bắt đầu từ 1
- [x] Thêm chức năng lấy thông tin profile từ API và hiển thị avatar trong MainLayout
- [x] Khôi phục chức năng giỏ hàng trong MainLayout
- [x] Sửa lỗi gọi API liên tục trong MainLayout bằng cách thêm dependency array cho useEffect
- [x] Sửa lỗi vòng lặp liên tục giữa Login và Dashboard bằng cách cải thiện cơ chế xác thực và chuyển hướng
- [x] Sửa lỗi hiển thị avatar trong dialog xem chi tiết tài khoản bằng cách thêm đường dẫn đầy đủ
- [x] Cải thiện bảo mật khi tải avatar bằng cách sử dụng token trong header thay vì URL
- [x] Xóa cột "Đăng nhập cuối" trong bảng danh sách tài khoản
- [x] Loại bỏ các dòng console.error không cần thiết trong AccountsPage.tsx
- [x] Thêm menu con "Vai trò" và "Phân Quyền" vào menu "Người dùng"
- [x] Tạo trang quản lý vai trò người dùng với chức năng xem danh sách và phân trang
- [x] Thêm chức năng xem chi tiết vai trò và danh sách quyền
- [x] Cải thiện giao diện chi tiết vai trò (RoleDetailDialog) với thiết kế hiện đại và trực quan hơn
- [x] Thêm chức năng thêm vai trò mới với dialog xác nhận
- [x] Thêm chức năng xóa vai trò với dialog xác nhận
- [x] Cải thiện chức năng xem chi tiết vai trò bằng cách lấy dữ liệu từ API GET /api/role/{roleId}
- [x] Thêm trạng thái loading vào dialog xem chi tiết vai trò
- [x] Thêm xử lý lỗi khi lấy chi tiết vai trò thất bại
- [x] Sửa lỗi hiển thị số quyền trong danh sách vai trò bằng cách lấy đầy đủ thông tin từ API chi tiết
- [x] Cập nhật hiển thị vai trò trong danh sách tài khoản để hiển thị vai trò có số lượng Permission nhiều nhất
- [x] Sửa lỗi không thể cuộn xuống hết danh sách permission trong dialog thêm/sửa vai trò
- [x] Thêm menu giỏ hàng vào layout chính với chức năng xem danh sách và xóa sản phẩm
- [x] Tạo trang quản lý giỏ hàng với chức năng xem danh sách và quản lý giỏ hàng
- [x] Tạo service cartService.ts
- [x] Sửa lỗi không thể check chọn vai trò trong EditAccountDialog
- [x] Sửa lỗi cập nhật vai trò trong trang quản lý tài khoản
- [x] Tạo component CartMenu.tsx
- [x] Tích hợp CartMenu vào MainLayout
- [x] Tạo trang CartsPage.tsx để hiển thị và quản lý giỏ hàng
- [x] Cập nhật Dashboard để lấy tổng số khách hàng từ API thay vì giá trị mặc định
- [x] Lấy thống kê tài khoản từ API
- [x] Cải thiện giao diện xem thông tin chi tiết tài khoản với bố cục rõ ràng và trực quan hơn
- [x] Tạo trang quản lý quyền hạn với chức năng xem danh sách, tạo, sửa và xóa quyền
- [x] Tạo service permissionService để gọi API quyền hạn
- [x] Sửa lỗi menu Quyền hạn hiển thị submenu thay vì chuyển đến trang danh sách
- [x] Cải thiện giao diện trang quyền hạn bằng cách bỏ cột trạng thái và ngày tạo
- [x] Cập nhật dialog thêm quyền hạn để đánh dấu trường Tên quyền là bắt buộc
- [x] Tạo trang hiển thị sản phẩm với chức năng xem danh sách từ API
- [x] Tạo service productService.ts để gọi API sản phẩm
- [x] Tạo trang ProductTypesPage.tsx để hiển thị danh sách sản phẩm
- [x] Tái cấu trúc AddRoleDialog.tsx thành các component nhỏ hơn để cải thiện tính bảo trì
- [x] Xóa cột ngày tạo trong bảng danh sách tài khoản
- [x] Tái cấu trúc trang quản lý tài khoản thành các file nhỏ hơn để dễ quản lý
- [x] Hiển thị tên đầy đủ trong bảng tài khoản
- [x] Cập nhật hiển thị vai trò trong các thành phần để hiển thị tên vai trò trực tiếp từ API thay vì chuyển đổi cứng
- [x] Cải thiện EditAccountDialog để hiển thị các role đã được chọn sẵn khi mở dialog chỉnh sửa
- [x] Sửa lỗi TypeScript cho phương thức isAxiosError trong axiosInstance
- [x] Thêm APP_CONFIG vào config.ts để sửa lỗi biên dịch
- [x] Sửa lỗi kiểu dữ liệu trong UserInfoCard.tsx, thay false bằng '-' trong formatDate
- [x] Cải thiện ProfileMenu để hiển thị Avatar, tên đầy đủ và email của người dùng khi bấm vào Avatar
- [x] Cải thiện trang chi tiết giỏ hàng để hiển thị thêm tổng số lượng sản phẩm bên cạnh tổng số mục
- [x] Thêm trường chọn vai trò vào form tạo tài khoản
- [x] Cập nhật chức năng xóa tài khoản để gọi API DELETE /api/account/{accountId}
- [x] Cải thiện trải nghiệm người dùng bằng cách giữ nguyên pageIndex hiện tại khi làm mới danh sách sau khi tạo, chỉnh sửa, xóa tài khoản hoặc thay đổi trạng thái

## Quản lý Token và Xác thực

- [x] Tạo `src/utils/authUtils.ts` với các hàm tiện ích để quản lý token
- [x] Tạo `src/utils/axiosInstance.ts` để cấu hình Axios với interceptor tự động thêm token
- [x] Cập nhật các service để sử dụng axiosInstance thay vì axios trực tiếp:
  - [x] accountService.ts
  - [x] categoryService.ts
  - [x] productService.ts
  - [x] permissionService.ts
  - [x] roleService.ts
- [x] Cập nhật chức năng quản lý vai trò:
  - [x] Sử dụng endpoint `/api/role/page` để lấy danh sách vai trò và quyền hạn trong một lần gọi API
  - [x] Loại bỏ các lần gọi API `/api/role/{roleId}` vì dữ liệu đã có trong response của `/api/role/page`
  - [x] Thêm hàm xóa vai trò gọi endpoint DELETE `/api/role/{roleId}`
  - [x] roleService.ts
  - [x] cartService.ts
- [x] Sửa lỗi xác thực:
  - [x] Sửa hàm getToken() để lấy token đúng cách từ authState trong localStorage
  - [x] Cập nhật hàm redirectToLogin() để tránh vòng lặp chuyển hướng
  - [x] Sử dụng avatar mặc định từ UI Avatars khi không có avatar
  - [x] Cải thiện cách lưu trữ và khôi phục thông tin xác thực
- [ ] Cài đặt cơ chế refresh token khi token hết hạn
- [ ] Cải thiện xử lý lỗi xác thực
- [ ] Thêm logging chi tiết cho các sự kiện xác thực

## Đang thực hiện
- [ ] Thêm chức năng chỉnh sửa vai trò:
  - [x] Tạo giao diện chỉnh sửa vai trò
  - [ ] Thêm API PUT /api/role/{roleId} để cập nhật thông tin vai trò
- [ ] Hoàn thiện chức năng quản lý tài khoản
  - [x] Tạo form thêm tài khoản mới
  - [ ] Tạo form chỉnh sửa tài khoản
  - [x] Xử lý khóa/mở khóa tài khoản
  - [x] Xử lý xóa tài khoản
- [ ] Tạo trang quản lý danh mục sản phẩm
  - [x] Hiển thị danh sách danh mục
  - [x] Thêm chức năng tạo danh mục mới
  - [ ] Thêm chức năng chỉnh sửa danh mục
  - [ ] Thêm chức năng xóa danh mục
- [ ] Hoàn thiện chức năng quản lý vai trò người dùng
  - [x] Hiển thị danh sách vai trò
  - [x] Thêm chức năng xem chi tiết vai trò
  - [x] Thêm chức năng tạo vai trò mới
  - [x] Thêm chức năng xóa vai trò
  - [ ] Thêm chức năng chỉnh sửa vai trò
- [ ] Tạo trang quản lý sản phẩm
  - [x] Hiển thị danh sách sản phẩm
  - [x] Thêm chức năng tạo sản phẩm mới
  - [x] Thêm chức năng xem chi tiết sản phẩm
  - [ ] Thêm chức năng chỉnh sửa sản phẩm
  - [ ] Thêm chức năng xóa sản phẩm
- [ ] Tạo trang quản lý đơn hàng
- [ ] Hoàn thiện chức năng quản lý giỏ hàng
  - [x] Hiển thị menu giỏ hàng với danh sách sản phẩm
  - [x] Thêm chức năng xóa sản phẩm khỏi giỏ hàng
  - [x] Thêm chức năng xem chi tiết sản phẩm trong giỏ hàng
  - [ ] Tạo trang quản lý giỏ hàng đầy đủ
  - [ ] Cải thiện chức năng xóa mục giỏ hàng (cần kiểm tra lại API endpoint)
  - [ ] Thêm chức năng cập nhật số lượng sản phẩm trong giỏ hàng
  - [ ] Thêm chức năng chuyển giỏ hàng thành đơn hàng
- [ ] Hoàn thiện chức năng quản lý quyền hạn
  - [x] Hiển thị danh sách quyền hạn
  - [x] Thêm chức năng tạo quyền hạn mới
  - [x] Thêm chức năng chỉnh sửa quyền hạn
  - [x] Thêm chức năng xóa quyền hạn
  - [ ] Thêm chức năng phân quyền cho vai trò
  - [ ] Thêm chức năng phân quyền cho người dùng

## Cần thực hiện
- [ ] Phát triển các chức năng quản lý khác
  - [ ] Quản lý danh mục sản phẩm
  - [ ] Quản lý sản phẩm
  - [ ] Quản lý đơn hàng
  - [ ] Quản lý khách hàng
  - [x] Quản lý vai trò người dùng
  - [x] Quản lý phân quyền người dùng
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
