# Website Nhà hàng Ngọc Tước

Website tĩnh (HTML/CSS/JS) — không cần build, mở trực tiếp hoặc up lên bất kỳ hosting nào.

## Cấu trúc
- `index.html` — Trang chủ
- `menu.html` — Thực đơn (nhóm món + nút tải PDF đầy đủ)
- `about.html` — Về chúng tôi
- `gallery.html` — Hình ảnh & Video (nhúng feed **Facebook** + **TikTok**)
- `contact.html` — Liên hệ & Đặt bàn (bản đồ + form)
- `css/style.css`, `js/main.js`
- `assets/logo.jpg` — logo hoa sen Ngọc Tước
- `menu/Menu-Ngoc-Tuoc.pdf` — menu gốc (khách tải về)

## Thông tin đã chốt
- **Số điện thoại / Zalo:** 0778 166 166 (đã cập nhật toàn site).
- **Facebook:** `https://www.facebook.com/profile.php?id=100064023433682` (URL chuẩn của trang "Ngọc Tước Restaurant", đã thay link chia sẻ cũ).
- **TikTok:** `@nhahangngoctuoc` — feed tự hiển thị video mới nhất.

## ⚠️ Còn nên chỉnh
1. Ảnh minh họa (món ăn, không gian) hiện lấy từ Unsplash — nên thay bằng **ảnh thật** của nhà hàng để chuẩn thương hiệu.
2. Feed Facebook & TikTok chỉ hiển thị đầy đủ khi web chạy trên **tên miền thật** (deploy), không phải khi mở file cục bộ.

## Chạy thử tại máy
Mở `index.html` bằng trình duyệt, hoặc chạy server tĩnh:
```
npx serve -l 5500 .
```

## Đưa lên mạng (miễn phí)
Kéo-thả cả thư mục vào **Netlify Drop** (app.netlify.com/drop) hoặc **Vercel** / **GitHub Pages**. Feed FB & TikTok chỉ hiển thị đầy đủ khi web chạy trên tên miền thật (không phải mở file cục bộ).
