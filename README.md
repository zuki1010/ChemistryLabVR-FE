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
- Reaction: xem danh sách/chi tiết, tạo, cập nhật và lưu trữ; thao tác ghi chỉ dành cho LECTURER/ADMIN.
- Form phản ứng chọn hóa chất từ thư viện, nhập hệ số, chất xúc tác, điều kiện, chiều thuận nghịch và hiện tượng sản phẩm.

## Education

- Giảng viên/ADMIN tạo học phần và chủ đề, mở lớp, quản lý học viên, tạo bài quiz hoặc thực hành Unity, xuất bản và giao bài cho lớp.
- Học viên tham gia bằng mã, xem chủ đề, làm quiz và bắt đầu bài thực hành.
- Quiz hiện hỗ trợ trắc nghiệm một đáp án đúng; BE không gửi đáp án đúng cho học viên trước khi nộp.
- Unity đọc cấu hình bằng GET /api/v1/education/attempts/{id} và gửi action log bằng POST /api/v1/education/attempts/{id}/practice-submit.
- Đặt VITE_UNITY_URL để hiển thị nút mở Unity. Unity client cần tự xác thực với BE bằng access token.

## Giới hạn hiện tại

- Portal khởi tạo attempt và cung cấp cấu hình, nhưng không nhúng runtime Unity.
- Báo cáo tổng hợp theo lớp/học phần và các dạng câu hỏi ngoài trắc nghiệm một đáp án chưa có.