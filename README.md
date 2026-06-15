# Transformation Coaching — VCI International (clean rebuild)

Landing page dựng lại bằng **HTML/CSS sạch**, không phụ thuộc nền tảng GoHighLevel.
Dựng lại từ bản gốc: https://icf-lv1.vcicoach.com/start

## Chạy thử
Mở `index.html` bằng trình duyệt (double-click). Không cần build, không cần server.
Cần internet cho 2 thứ: Google Fonts (Anton + Inter) và các link mạng xã hội ở footer.

## Cấu trúc
```
index.html      — toàn bộ nội dung, chia section có comment rõ ràng (nguồn chính, đã chỉnh tay bám sát bản gốc)
styles.css      — style + brand tokens (biến CSS ở :root)
images/         — 39 ảnh (logo, ảnh coach, chứng nhận, collage, avatar/ảnh học viên, nền)
```
> `index.html` đã được tinh chỉnh trực tiếp để khớp khung bản gốc (vượt ngoài bản script sinh ban đầu) — hãy sửa thẳng file này, đừng chạy lại script `_build` (sẽ ghi đè các tinh chỉnh).

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

Có 7 nút CTA dùng `#dang-ky`: Hero, mục "4 - Cộng đồng", mục "10 điểm khác biệt", block giá,
mục Cam kết, FAQ, và nút nổi góc phải. Thay tất cả bằng find & replace là xong.

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
- **Phần "Sự chuyển hoá của học viên" (video testimonials):** bản gốc nhúng video; bản static này dùng
  ô placeholder có nút play (chưa gắn video thật). Để gắn video, thay `<div class="video-thumb">…</div>`
  bằng thẻ `<iframe>` YouTube/Vimeo của bạn, hoặc bọc ô đó trong link `<a href="...">`.
- Ảnh tham chiếu bản gốc nằm trong `screenshot/` (không commit lên git, chỉ lưu local).
