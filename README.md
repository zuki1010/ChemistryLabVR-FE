# ChemistryLabVR Web

Frontend React + Vite cho các API hiện có trong ChemistryLabVR BE.

## Chạy local

1. Chạy npm.cmd install
2. Chạy npm.cmd run dev
3. Mở http://localhost:5173

Cấu hình VITE_API_BASE_URL trong .env.local nếu muốn gọi trực tiếp một BE cụ thể. Nếu để trống, Vite proxy /api theo VITE_BACKEND_URL trong vite.config.js.

## Chức năng đã nối API

- Đăng nhập, đăng ký học viên, đăng xuất; access token được giữ trong sessionStorage.
- Chemical: xem danh sách/chi tiết, tạo, cập nhật và xóa mềm; thao tác ghi chỉ hiện với ADMIN/LECTURER.
- Reaction: xem danh sách và chi tiết.

## Giới hạn theo BE hiện tại

- Reaction POST đã có route nhưng service chưa lưu dữ liệu, nên giao diện chưa bật tạo Reaction.
- Category, Assignment, Submission, báo cáo và quản trị người dùng chưa có API tương ứng; giao diện không dùng dữ liệu mẫu cho các mục này.
- Unity runtime chưa được kết nối.
- Mức cảnh báo hóa chất là dữ liệu nội bộ, không thay thế phân loại GHS hoặc SDS.
