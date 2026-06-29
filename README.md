# 🏠 QuanLyTro — Hệ thống Quản Lý Phòng Trọ

Ứng dụng web quản lý & cho thuê phòng trọ với phân quyền 3 cấp **ADMIN / STAFF / USER**, tông màu trắng–xanh.

> Đồ án full-stack: **Spring Boot (Java)** + **React (Vite + Tailwind)** + **MySQL**, có tích hợp **AI (Claude)** để đăng tin nhanh.

---

## 📦 Cấu trúc

| Thư mục | Mô tả |
|---------|-------|
| [`backend/`](backend) | REST API — Spring Boot 3, Spring Security + JWT, JPA/MySQL, Swagger. Xem [backend/README.md](backend/README.md) |
| [`frontend/`](frontend) | Giao diện — React 18 + Vite + TailwindCSS. Xem [frontend/README.md](frontend/README.md) |
| [`demo.html`](demo.html) | Bản demo giao diện 1 file (mở bằng trình duyệt, dữ liệu mẫu, không cần cài đặt) |

---

## ✨ Tính năng chính

- **Khách (USER):** tìm kiếm & lọc phòng đa tiêu chí (vị trí 3 cấp, giá, diện tích, tiện ích…), xem chi tiết, **đặt lịch xem phòng**, ví tiền.
- **Nhân viên (STAFF):** đăng / sửa / xóa tin, **đẩy VIP** (trừ ví), quản lý lịch hẹn, dashboard + biểu đồ.
- **Quản trị (ADMIN):** kiểm duyệt tin, quản lý người dùng / tiện ích / giao dịch, thống kê + biểu đồ doanh thu.
- **AI — Đăng tin nhanh:** dán nguyên đoạn tin (Facebook/Zalo…) → Claude tự tách thông tin & điền sẵn form.

---

## 🚀 Chạy nhanh

**Yêu cầu:** JDK 21+, Node.js 18+, MySQL 8.

### 1) Backend
```bash
cd backend
# Đặt mật khẩu MySQL qua biến môi trường (hoặc tạo file application-local.yml)
#   PowerShell:  $env:DB_PASSWORD="matkhau_cua_ban"
./mvnw spring-boot:run         # hoặc trên Windows: .\run.ps1
```
API: http://localhost:8080/api · Swagger: http://localhost:8080/api/swagger-ui.html

### 2) Frontend
```bash
cd frontend
npm install
npm run dev                    # hoặc trên Windows: .\run.ps1
```
Web: http://localhost:5173

---

## 👤 Tài khoản dùng thử (tự tạo khi chạy lần đầu)

| Vai trò | Username / Password |
|---------|--------------------|
| ADMIN | `admin` / `admin123` |
| STAFF | `staff` / `staff123` |
| USER | `user` / `user123` |

---

## 🔐 Lưu ý bảo mật

- **Không commit mật khẩu.** Mật khẩu MySQL truyền qua biến môi trường `DB_PASSWORD` hoặc file `application-local.yml` (đã được `.gitignore`).
- Khi triển khai thật: đổi `APP_JWT_SECRET` và đặt `ANTHROPIC_API_KEY` (nếu dùng AI) qua biến môi trường.
