# Quản Lý Trọ — Frontend (React + Vite + Tailwind)

Giao diện người dùng cho hệ thống **Quản Lý Trọ**, kết nối với backend Spring Boot REST API.
Tông màu chủ đạo **trắng – xanh**, đầy đủ giao diện cho **3 vai trò: USER / STAFF / ADMIN**.

---

## 1. Công nghệ

| Thành phần | Phiên bản |
|------------|-----------|
| React | 18 |
| Vite | 5 |
| Tailwind CSS | 3 |
| React Router | 6 |
| Axios | 1.x (tự refresh token) |
| Recharts | biểu đồ doanh thu |
| lucide-react | icon |
| react-hot-toast | thông báo |

## 2. Yêu cầu
- **Node.js 18+** (máy bạn đang dùng Node 24 — OK).
- **Backend đang chạy** ở `http://localhost:8080/api` (xem dự án `quanlytro-backend`).

## 3. Cấu hình
File [.env](.env):
```
VITE_API_BASE_URL=http://localhost:8080/api
```
Backend đã bật CORS cho `localhost:5173` nên không cần cấu hình thêm.

## 4. Chạy

### Cách 1 — script tiện lợi (PowerShell)
```powershell
cd C:\Users\ADMIN\quanlytro-frontend
.\run.ps1            # dev server -> http://localhost:5173
.\run.ps1 build      # build production (dist/)
```

### Cách 2 — npm
```powershell
npm install      # lần đầu
npm run dev      # phát triển
npm run build    # đóng gói
npm run preview  # xem thử bản build
```

> Mở trình duyệt tại **http://localhost:5173**

## 5. Tài khoản dùng thử
| Vai trò | Username / Password | Vào trang |
|---------|--------------------|-----------|
| ADMIN | `admin` / `admin123` | `/admin` |
| STAFF | `staff` / `staff123` | `/staff` |
| USER | `user` / `user123` | trang chủ |

(Trang đăng nhập có sẵn nút điền nhanh 3 tài khoản này.)

## 6. Tính năng theo vai trò

**Khách / USER**
- Trang chủ + ô tìm kiếm nhanh (từ khóa, tỉnh, loại hình).
- Trang danh sách với **bộ lọc đa tiêu chí**: loại hình, khu vực 3 cấp, khoảng giá, diện tích, nhiều tiện ích, sắp xếp. Tin **VIP** luôn lên đầu.
- Chi tiết phòng (thư viện ảnh, tiện ích, thông tin liên hệ) + **đặt lịch xem phòng**.
- Hồ sơ cá nhân, đổi mật khẩu, lịch hẹn của tôi, **ví tiền** (nạp tiền + lịch sử giao dịch).

**STAFF** — `/staff`
- Tổng quan (thống kê tin + biểu đồ chi tiêu) .
- Đăng / sửa / xóa tin (upload nhiều ảnh, chọn tiện ích, địa chỉ 3 cấp).
- **Đẩy / gia hạn VIP** (trừ tiền ví).
- Quản lý lịch hẹn xem phòng (xác nhận / hoàn thành / hủy).
- Nạp tiền vào ví.

**ADMIN** — `/admin`
- Tổng quan toàn hệ thống + **biểu đồ doanh thu 12 tháng**.
- **Kiểm duyệt tin** (duyệt / từ chối kèm lý do / xóa).
- Quản lý người dùng (tạo, phân quyền, khóa/mở, xóa).
- Quản lý tiện ích (CRUD).
- Xem toàn bộ giao dịch & lịch hẹn.

## 7. Cấu trúc thư mục
```
src/
├── api/          # axiosClient (token + auto refresh) + các module API
├── components/
│   ├── common/   # Spinner, Modal, Pagination, StatCard, ...
│   ├── dashboard/# RevenueChart
│   ├── layout/   # Navbar, Footer, Sidebar, AccountNav, layouts
│   ├── post/     # PostCard, LocationSelect, AmenityCheckboxGroup, ImageUploader
│   └── ProtectedRoute.jsx
├── context/      # AuthContext (đăng nhập, lưu phiên)
├── pages/
│   ├── public/   # Home, danh sách, chi tiết, login, register, 404/403
│   ├── user/     # Hồ sơ, lịch hẹn, ví
│   ├── staff/    # Dashboard, tin đăng, đăng/sửa tin, lịch hẹn
│   └── admin/    # Dashboard, duyệt tin, người dùng, tiện ích, giao dịch, lịch hẹn
└── utils/        # format (tiền/ngày/ảnh) + constants (nhãn enum)
```

## 8. Ghi chú
- Phiên đăng nhập lưu ở `localStorage`; axios tự gắn `Bearer` token và **tự gọi `/auth/refresh`** khi token hết hạn.
- Ảnh tải lên đi qua `POST /api/files/upload`, hiển thị lại qua URL `/api/files/...`.
- Bundle hiện gộp 1 file (~730kB). Có thể tách nhỏ bằng `manualChunks` nếu cần tối ưu — không bắt buộc cho đồ án.
- Đổi tông màu: sửa palette `primary` trong [tailwind.config.js](tailwind.config.js).
