## 🔧 Coding Convention & UI/UX Style Guide cho RAG Learning Assistant

### 1. **Hiệu ứng loading**

- Tất cả các trạng thái loading (Uploading, Working, Saving, Generating Quiz, ...):
  - Dùng cùng một loại spinner hoặc animation (ví dụ: dots nhảy, circular spinner, linear bar).
  - Màu sắc loading: chủ đạo #A6B1E1 hoặc #424874, nền mờ #F4EEFF.
  - Loading overlay che mờ background, icon loading luôn ở giữa màn hình/thành phần.
  - Có thể dùng cùng một component loading dùng lại cho toàn bộ app.

### 2. **CSS và Style**

- Tất cả style sử dụng Tailwind CSS hoặc Material-UI, không trộn lẫn CSS inline và CSS module.
- Màu sắc đồng bộ, chỉ sử dụng palette:
  - Primary: `#424874`
  - Secondary: `#A6B1E1`
  - Accent: `#DCD6F7`
  - Background: `#F4EEFF`
- Font chữ sử dụng duy nhất một hoặc hai loại (Inter, Roboto, hoặc Montserrat), không dùng font hệ thống lẫn lộn.
- Button, input, card, stepper, icon đều bo tròn, có shadow nhẹ, padding/margin đều nhau.
- Responsive: mọi thành phần đều kiểm tra trên mobile, tablet, desktop.
- Không dùng emoji hay icon mặc định, chỉ dùng icon từ thư viện (Material-UI, React Icons, Heroicons).

### 3. **Component reuse**

- Các thành phần UI như Button, Card, Stepper, Toast, Modal phải là component riêng, import & dùng lại toàn app.
- Không copy-paste từng đoạn code giống nhau cho nhiều màn hình.

### 4. **Hiệu ứng chuyển cảnh**

- Khi chuyển step, chuyển màn hình, hoặc hiện/ẩn card, quiz: dùng animation mượt (fade, slide, scale).
- Toast/snackbar thông báo luôn có hiệu ứng fade in/out, màu sắc đồng bộ.
- Khi quiz chuyển câu, option được chọn highlight rõ, có hiệu ứng scale hoặc glow.

### 5. **Coding convention**

- Đặt tên biến, hàm, component rõ nghĩa, dùng tiếng Anh, theo chuẩn camelCase hoặc PascalCase.
- Tách logic và UI: component chỉ render UI, mọi logic xử lý nằm ở hook hoặc service riêng.
- Comment ngắn gọn, đúng chỗ cho các đoạn code phức tạp.
- Không để lại code chết, console.log thừa.
- Luôn kiểm tra null/undefined với API, tránh crash UI.
- Sử dụng TypeScript chặt chẽ, luôn định nghĩa type cho props, state.

### 6. **Thông báo & trạng thái**

- Toàn bộ thông báo (thành công, lỗi, warning) dùng cùng một Toast/Snackbar component.
- Icon thông báo: check (thành công), warning (cảnh báo), error (lỗi), info (hướng dẫn) đều lấy từ thư viện, màu sắc đồng bộ.

### 7. **Test UI**

- Luôn test giao diện trên Chrome, Firefox, Edge và mobile (iOS/Android).
- Check tất cả trạng thái: loading, success, error, empty.

### 8. **Accessibility**

- Các nút, input, link đều có aria-label, tab index, màu sắc đủ tương phản.
- Text dễ đọc, không dùng màu quá nhạt hoặc font quá nhỏ.

---

## 📌 Tóm tắt

- Mọi hiệu ứng, style, icon, component đều đồng bộ, thống nhất toàn bộ app.
- Code rõ ràng, sạch, dễ bảo trì, dễ mở rộng.
- UI/UX nhất quán, luôn đẹp trên mọi thiết bị.
