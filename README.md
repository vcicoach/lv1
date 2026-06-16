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

## Nút "Đăng ký / Tư vấn" → form ngoài
Tất cả nút CTA đã trỏ tới form tư vấn bên ngoài, **mở tab mới**:

```
href="https://go.vcicoach.com/icf-lv1-tu-van" target="_blank" rel="noopener"
```

Có 7 nút: Hero, mục "4 - Cộng đồng", mục "10 điểm khác biệt", block giá, mục Cam kết, FAQ, và nút
nổi góc phải. Muốn đổi link khác: find & replace `https://go.vcicoach.com/icf-lv1-tu-van` trong `index.html`.

## Đường dẫn (chạy được cả `/` và `/start`)
- Trang chính nằm ở thư mục gốc → `https://<domain>/`.
- `start/index.html` giữ lại cho các link cũ ở `/start` (quảng cáo, backlink), tự chuyển hướng về gốc và
  **giữ nguyên tham số `?utm_...`**. Muốn `/start` là URL chính thay vì gốc thì làm ngược lại — báo mình.

## Sửa nội dung
Text nằm trực tiếp trong `index.html` — sửa thẳng. Mỗi section có comment đánh dấu.
Đổi ảnh: thay file trong `images/` (giữ nguyên tên) hoặc sửa `src` trong HTML.

## Ghi chú
- Trang được sinh từ script `_build/build.mjs` (đọc nội dung trích xuất `content.json` +
  cấu trúc `struct.json`). Bạn có thể sửa trực tiếp `index.html`/`styles.css` mà không cần
  script — script chỉ là công cụ dựng lần đầu.
- Font tiêu đề: `--brand` (**Anton**, đậm) chỉ dùng cho tiêu đề thương hiệu lớn "TRANSFORMATION COACHING";
  còn lại tiêu đề section/feature dùng `--display` = **Inter** cho dễ đọc (Anton hiển thị tiếng Việt quá đậm).
- `docs/noi-dung-chuan.md`: nội dung + layout chuẩn trích từ bản gốc, dùng để đối chiếu khi sửa nội dung.
- 4 Module có đầy đủ panel "Mục tiêu học tập" + "Nội dung" (mở rộng bằng thẻ `<details>`).
- **Phần "Sự chuyển hoá của học viên" (video testimonials):** bản gốc nhúng video. Hiện đang dùng
  **ảnh thumbnail tạm** (`images/vid-*.jpg`, cắt từ ảnh chụp bản gốc) + nút play — **cần thay video thật sau**.
  Để gắn video: thay `<img src="images/vid-*.jpg">` trong `<div class="video-thumb">` bằng `<iframe>`
  YouTube/Vimeo, hoặc bọc cả ô trong link `<a href="...">`.
- Ảnh tham chiếu bản gốc nằm trong `screenshot/` (không commit lên git, chỉ lưu local).
