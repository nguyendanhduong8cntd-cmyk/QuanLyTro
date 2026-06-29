# Quản Lý Trọ — Backend (Spring Boot)

Backend REST API cho hệ thống quản lý phòng trọ với phân quyền 3 cấp **ADMIN / STAFF / USER**, xác thực **JWT**, đăng & kiểm duyệt tin, đặt lịch xem phòng, ví tiền, gói VIP và thống kê doanh thu.

Xây dựng dựa trên schema trong `home.sql`.

---

## 1. Công nghệ

| Thành phần      | Phiên bản |
|-----------------|-----------|
| Java            | 21+ (đã test trên JDK 25) |
| Spring Boot     | 3.5.3 |
| Spring Security + JWT (jjwt) | 0.12.6 |
| Spring Data JPA / Hibernate | — |
| MySQL           | 8.x |
| Lombok          | 1.18.46 |
| Swagger / OpenAPI (springdoc) | 2.8.6 |
| Build           | Maven |

---

## 2. Yêu cầu

- **JDK 21 trở lên** (máy bạn đang dùng JDK 25 — OK).
- **MySQL 8** đang chạy ở `localhost:3306`.
- Maven **không bắt buộc cài** — đã có sẵn Maven Wrapper (`mvnw`).

---

## 3. Cấu hình Database

Mặc định kết nối:

```
host     : localhost:3306
database : QuanLyTro   (tự động tạo nếu chưa có — createDatabaseIfNotExist=true)
username : root
password : (đã cấu hình sẵn theo MySQL trên máy bạn trong application.yml)
```

> ⚠️ Mật khẩu DB đang để mặc định trong `application.yml`. Khi đưa lên môi trường khác / chia sẻ code,
> nên xóa mật khẩu khỏi file và truyền qua biến môi trường `DB_PASSWORD`.

Bảng sẽ **tự sinh** từ entity (`spring.jpa.hibernate.ddl-auto=update`) khi khởi động lần đầu,
nên bạn **không nhất thiết phải chạy `home.sql`**. Nếu muốn dùng đúng schema gốc, cứ chạy `home.sql` trước.

Nếu MySQL của bạn dùng mật khẩu khác, sửa trong [src/main/resources/application.yml](src/main/resources/application.yml)
hoặc đặt biến môi trường trước khi chạy:

```powershell
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "matkhau_cua_ban"
```

---

## 4. Chạy ứng dụng

### Cách 1 — script tiện lợi (Windows PowerShell)
```powershell
cd C:\Users\ADMIN\quanlytro-backend
.\run.ps1            # chạy app
.\run.ps1 build      # chỉ build JAR
```
Script tự tìm `JAVA_HOME` và Maven.

### Cách 2 — Maven Wrapper
```powershell
# (đặt JAVA_HOME tới JDK nếu chưa có)
$env:JAVA_HOME = "C:\Program Files\Java\jdk-25.0.2"
.\mvnw spring-boot:run
```

### Cách 3 — chạy JAR đã đóng gói
```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-25.0.2"
java -jar target\quanlytro-backend-1.0.0.jar
```

Sau khi chạy:
- API gốc: **http://localhost:8080/api**
- Swagger UI: **http://localhost:8080/api/swagger-ui.html**

---

## 5. Tài khoản tạo sẵn (seed)

Khi DB còn trống, hệ thống tự tạo:

| Vai trò | Username | Password   |
|---------|----------|------------|
| ADMIN   | `admin`  | `admin123` |
| STAFF   | `staff`  | `staff123` (ví 500.000đ) |
| USER    | `user`   | `user123`  |

Kèm 10 tiện ích mẫu và dữ liệu địa giới hành chính mẫu (2 tỉnh, 4 quận, 6 phường) để đăng tin được ngay.

---

## 6. Luồng xác thực (JWT)

1. `POST /api/auth/login` → nhận `accessToken` + `refreshToken`.
2. Gọi API cần quyền: thêm header `Authorization: Bearer <accessToken>`.
3. Token hết hạn → `POST /api/auth/refresh` với `refreshToken`.

Trên Swagger UI: bấm **Authorize** (góc phải) rồi dán `accessToken`.

---

## 7. Danh sách API chính

> Tất cả đều có tiền tố `/api`.

### Auth — `/auth`
| Method | Path | Quyền |
|--------|------|-------|
| POST | `/auth/register` | công khai |
| POST | `/auth/login` | công khai |
| POST | `/auth/refresh` | công khai |

### Users — `/users`
| Method | Path | Quyền |
|--------|------|-------|
| GET | `/users/me` | đã đăng nhập |
| PUT | `/users/me` | đã đăng nhập |
| PUT | `/users/me/password` | đã đăng nhập |
| GET | `/users` (lọc keyword/role/status) | ADMIN |
| POST | `/users` (tạo STAFF…) | ADMIN |
| PUT | `/users/{id}` (đổi role/khóa-mở) | ADMIN |
| DELETE | `/users/{id}` | ADMIN |

### Amenities — `/amenities`
| GET `/amenities`, GET `/amenities/{id}` | công khai |
| POST / PUT / DELETE | ADMIN |

### Locations — `/locations`
| GET `/locations/provinces` | công khai |
| GET `/locations/provinces/{id}/districts` | công khai |
| GET `/locations/districts/{id}/wards` | công khai |
| POST `/locations/{provinces,districts,wards}` | ADMIN |

### Posts — `/posts`
| Method | Path | Quyền |
|--------|------|-------|
| GET | `/posts` (tìm kiếm + lọc, chỉ tin APPROVED, VIP lên đầu) | công khai |
| GET | `/posts/{id}` | công khai |
| GET | `/posts/my` | STAFF/ADMIN |
| GET | `/posts/admin` (lọc mọi trạng thái) | ADMIN |
| POST | `/posts` (đăng tin → PENDING) | STAFF/ADMIN |
| PUT | `/posts/{id}` | chủ tin / ADMIN |
| DELETE | `/posts/{id}` | chủ tin / ADMIN |
| PATCH | `/posts/{id}/approve` | ADMIN |
| PATCH | `/posts/{id}/reject` | ADMIN |
| PATCH | `/posts/{id}/rented` | chủ tin / ADMIN |
| POST | `/posts/{id}/vip` (mua VIP, trừ ví) | chủ tin |

**Tham số lọc cho `GET /posts`** (query string): `keyword, type, provinceId, districtId, wardId,
minPrice, maxPrice, minArea, maxArea, amenityIds (lặp lại), isVip, page, size, sortBy(createdAt|price|area), sortDir(asc|desc)`.
Ví dụ: `/api/posts?provinceId=01&type=PHONG_TRO&minPrice=1000000&maxPrice=3000000&amenityIds=1&amenityIds=2`

### Appointments — `/appointments`
| POST `/appointments` (đặt lịch) | đã đăng nhập |
| GET `/appointments/my` | khách |
| GET `/appointments/staff` | STAFF/ADMIN |
| GET `/appointments/admin` | ADMIN |
| PATCH `/appointments/{id}/status` | chủ tin/ADMIN (mọi trạng thái), khách (chỉ hủy) |

### Transactions / Ví — `/transactions`
| POST `/transactions/deposit` (nạp ví) | đã đăng nhập |
| GET `/transactions/my` | đã đăng nhập |
| GET `/transactions/admin` | ADMIN |

### Files — `/files`
| POST `/files/upload` (1 ảnh, form-data field `file`) | đã đăng nhập |
| POST `/files/upload-multiple` (field `files`) | đã đăng nhập |
| GET `/files/{filename}` | công khai |

Quy trình đăng tin có ảnh: upload ảnh trước → lấy `url` trả về → đưa vào mảng `imageUrls` khi `POST /posts`.

### Dashboard — `/dashboard`
| GET `/dashboard/admin` | ADMIN |
| GET `/dashboard/staff` | STAFF/ADMIN |
| GET `/dashboard/revenue?year=2026` (biểu đồ 12 tháng) | ADMIN (toàn hệ thống) / STAFF (của mình) |

---

## 8. Quy ước nghiệp vụ

- **Gói VIP**: 10.000đ/ngày, trừ trực tiếp từ ví STAFF; gia hạn cộng dồn nếu còn hạn.
  Bài VIP hết hạn được tự động hạ xuống thường (scheduler chạy 00:05 hằng ngày).
- **Kiểm duyệt**: tin mới = `PENDING`; STAFF sửa tin → quay lại `PENDING` để duyệt lại.
- **Đặt lịch**: chỉ với tin đã `APPROVED`; không tự đặt lịch tin của chính mình.
- **Response** thống nhất dạng `{ success, message, data }`; lỗi trả `{ success:false, status, error, message, ... }`.

---

## 9. Biến môi trường (tùy chọn)

| Biến | Mặc định | Ý nghĩa |
|------|----------|---------|
| `DB_HOST` / `DB_PORT` / `DB_NAME` | localhost / 3306 / QuanLyTro | Kết nối MySQL |
| `DB_USERNAME` / `DB_PASSWORD` | root / root | Tài khoản MySQL |
| `APP_JWT_SECRET` | (chuỗi demo) | **Đổi khi chạy thật** — base64 ≥ 64 ký tự |
| `APP_UPLOAD_DIR` | `uploads` | Thư mục lưu ảnh |
| `APP_CORS_ORIGINS` | localhost:3000,5173,8081 | Origin frontend được phép |
| `ANTHROPIC_API_KEY` | (trống) | Khóa Claude API để bật "Đăng tin nhanh bằng AI". Trống = tắt tính năng AI |
| `APP_AI_MODEL` | `claude-opus-4-8` | Model Claude dùng để trích xuất |

---

## 10. Cấu trúc thư mục

```
src/main/java/com/goldenboat/quanlytro/
├── config/        # Security, CORS, Swagger, seed dữ liệu, scheduling
├── controller/    # REST controllers
├── dto/           # Request/Response DTO
├── entity/        # JPA entities (+ enums)
├── exception/     # Exception + GlobalExceptionHandler
├── mapper/        # Chuyển entity ↔ DTO
├── repository/    # Spring Data JPA repositories
├── scheduler/     # Tác vụ định kỳ (hạ VIP hết hạn)
├── security/      # JWT provider, filter, UserDetails
└── service/       # Business logic
```

---

## 11. Lưu ý kỹ thuật

- Chạy trên **JDK 25**: Lombok đã nâng lên 1.18.46 và `main()` set `net.bytebuddy.experimental=true`
  để tương thích. Nếu dùng JDK 21 thì không cần quan tâm.
- `ddl-auto=update` tiện cho phát triển; khi schema ổn định nên đổi sang `validate`.

---

## 12. Đăng tin nhanh bằng AI (Claude)

Giúp STAFF khỏi gõ tay từng tin: dán nguyên đoạn tin (Facebook/Zalo...) → Claude tự tách
tiêu đề, mô tả, giá, diện tích, địa chỉ, loại hình, tiện ích và **điền sẵn form đăng tin**.

- Endpoint: `POST /api/posts/ai-extract` (STAFF/ADMIN) — body `{ "text": "..." }`.
- Dùng **Anthropic Java SDK** + **structured output** (ép JSON đúng cấu trúc), model mặc định `claude-opus-4-8`.
- Backend tự khớp tên Tỉnh/Quận/Phường và tiện ích về đúng ID trong hệ thống (bỏ dấu, bỏ tiền tố "Quận/Phường"...).

**Bật tính năng:** lấy API key tại https://console.anthropic.com → đặt biến môi trường rồi chạy lại:
```powershell
$env:ANTHROPIC_API_KEY = "sk-ant-..."
.\run.ps1
```
Nếu không đặt key, các chức năng khác vẫn chạy bình thường, chỉ nút "Phân tích bằng AI" báo chưa cấu hình.
