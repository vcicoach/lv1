# Transformation Coaching — VCI International (clean rebuild)

Landing page dựng lại bằng **HTML/CSS sạch**, không phụ thuộc nền tảng GoHighLevel.
Dựng lại từ bản gốc: https://icf-lv1.vcicoach.com/start

## Chạy thử
Mở `index.html` bằng trình duyệt (double-click). Không cần build, không cần server.
Cần internet cho 2 thứ: Google Fonts (Anton + Inter) và các link mạng xã hội ở footer.

## Cấu trúc
```
index.html      — toàn bộ nội dung, chia section có comment rõ ràng
styles.css      — style + brand tokens (biến CSS ở :root)
images/         — 34 ảnh (logo, ảnh coach, chứng nhận, avatar học viên, nền)
```

## Brand tokens (sửa trong styles.css → :root)
| Biến | Giá trị | Dùng cho |
|------|---------|----------|
| `--green` | #73A549 | màu chủ đạo, tiêu đề, nút |
| `--lime` | #A7D85B | nhấn (nút phụ, badge) |
| `--teal` | #1D4D54 | nền section đậm |
| `--navy` | #000321 | nền section tối |
| `--display` | Anton | font tiêu đề |
| `--body` | Inter | font nội dung |

## Nút "Đăng ký / Tư vấn" → link form ngoài
Hiện tất cả nút CTA dùng placeholder `href="#dang-ky"` (cuộn xuống block đăng ký).
Để bấm nút **nhảy sang form bên ngoài**, tìm & thay toàn bộ trong `index.html`:

```
href="#dang-ky"   →   href="https://link-form-cua-ban"   (thêm target="_blank" nếu muốn mở tab mới)
```

Có 5 nút CTA: Hero, block giá, mục Cam kết, FAQ, và nút nổi góc phải.

## Sửa nội dung
Text nằm trực tiếp trong `index.html` — sửa thẳng. Mỗi section có comment đánh dấu.
Đổi ảnh: thay file trong `images/` (giữ nguyên tên) hoặc sửa `src` trong HTML.

## Ghi chú
- Trang được sinh từ script `_build/build.mjs` (đọc nội dung trích xuất `content.json` +
  cấu trúc `struct.json`). Bạn có thể sửa trực tiếp `index.html`/`styles.css` mà không cần
  script — script chỉ là công cụ dựng lần đầu.
- Tiêu đề lớn dùng font **Anton**; chữ tiếng Việt thiếu glyph nên fallback sang serif —
  đúng như bản gốc hiển thị (xem biến `--display` trong styles.css nếu muốn đổi).
- 4 Module có đầy đủ panel "Mục tiêu học tập" + "Nội dung" (mở rộng bằng thẻ `<details>`).
- Ảnh tham chiếu bản gốc nằm trong `screenshot/` (không commit lên git, chỉ lưu local).
