# Thiết kế Figma: Đăng nhập / Đăng ký / Quản lý giao dịch

## Mục tiêu
- Tạo giao diện cho đăng nhập và đăng ký.
- Hiển thị thông tin tài khoản và số dư.
- Cho phép thêm giao dịch mới.
- Bảo vệ bằng xác thực an toàn và kiểm thử tích hợp.

## Luồng màn hình
1. Trang chính hiển thị:
   - Form đăng nhập.
   - Form đăng ký.
2. Sau khi đăng nhập thành công:
   - Hiển thị tên người dùng, email và số dư tài khoản.
   - Danh sách giao dịch gần nhất.
   - Form thêm giao dịch mới.
3. Giao dịch mới có thể là:
   - Nạp tiền (deposit)
   - Rút tiền (withdrawal)

## Yêu cầu giao diện
- Các trường nhập liệu rõ ràng: email, mật khẩu, tên.
- Nút `Đăng nhập`, `Đăng ký`, `Thêm giao dịch`.
- Khu vực hiển thị thông tin tài khoản: tên, email, số dư.
- Thông báo lỗi/đăng nhập thất bại rõ ràng.

## Bảo mật
- Mật khẩu người dùng phải băm trước khi lưu.
- Xác thực bằng JWT.
- Kiểm tra đầu vào với validator.
- CORS và các header bảo mật cơ bản.

## Kiểm thử tích hợp
- Đăng ký người dùng mới.
- Đăng nhập bằng người dùng đã đăng ký.
- Gọi API lấy thông tin tài khoản.
- Thêm giao dịch và kiểm tra số dư cập nhật.
