# Công việc cần làm

- [x] Thiết kế giao diện Figma cho đăng nhập và đăng ký.
- [x] Xây dựng logic đăng nhập và đăng ký trên server.
- [x] Hiển thị thông tin tài khoản và số dư sau khi đăng nhập.
- [x] Tạo giao diện thêm giao dịch (nạp/rút tiền).
- [x] Tích hợp xác thực JWT và bảo mật cơ bản (Helmet, CORS, rate limiting).
- [ ] Kiểm thử tích hợp API đăng ký, đăng nhập, truy vấn profile và thêm giao dịch.

## Tệp liên quan
- `server/index.js` - cấu hình Express và bảo mật.
- `server/routes/auth.js` - xử lý đăng ký và đăng nhập.
- `server/routes/account.js` - API profile và thêm giao dịch.
- `server/middleware/authMiddleware.js` - xác thực JWT.
- `server/public/index.html` - giao diện người dùng.
- `server/public/app.js` - logic frontend gọi API.
- `server/public/styles.css` - style giao diện.
- `server/tests/integration.test.js` - kiểm thử tích hợp.
