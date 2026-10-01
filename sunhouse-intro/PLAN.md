# Sunhouse — Video giới thiệu tập đoàn 15 giây · Kế hoạch sản xuất

**Thông số xuất:** MP4 (H.264 High, yuv420p) · 1920×1080 · 30 khung hình/giây CFR · đúng 450 khung (0–449) · 15,000 giây · AAC 48 kHz stereo.
**Trạng thái:** đã duyệt ảnh đại diện (stills) — **chưa kết xuất toàn bộ**. Đang chờ: (a) tệp dữ kiện thật cho `FACTS_PATH`, (b) xác nhận hướng hình ảnh, (c) tệp âm thanh.

> ⚠️ **Đường dẫn dữ kiện chưa được cung cấp.** Yêu cầu ghi `[FACTS PATH]` (chưa điền), và repo không có tệp dữ kiện nào. Vì vậy **không có tuyên bố thực tế nào được đưa lên hình**. Mọi chữ/số mang tính thông tin đều lấy từ một mục trong `facts/facts.template.json` (F01–F12) và hiện thành ô placeholder màu magenta `⟦F08⟧` cho tới khi mục đó có `value` + `source_url` + `status: "verified"`. Kết xuất cuối chạy với `--strict-facts` và sẽ **dừng** nếu còn mục nào chưa xác minh.

---

## 1. Danh sách cảnh quay

Lưới nhịp: 120 BPM → 1 phách = 15 khung = 0,500 s. Mọi điểm cắt cứng rơi đúng phách.

| # | Bắt đầu → Kết thúc (s) | Khung | Hành động tiêu điểm (một) | Nội dung / dữ kiện | Chuyển sang cảnh sau |
|---|---|---|---|---|---|
| S1 | 0,000 → 2,000 | 0–59 | **Mặt trời mọc** từ đường chân trời lên giữa khung (dừng ở f50) | Không chữ. Khung 0 đã có hình (nửa đĩa mặt trời + chân trời) — không bao giờ mở bằng khung trống | Cắt cứng f60 (phách 4) |
| S2 | 2,000 → 4,500 | 60–134 | **Wordmark trồi lên** qua mặt nạ, chạm đích ở f75 (2,500 s) | F01 thương hiệu · F03 câu định vị · F02 năm thành lập | "Sun-wipe": đĩa mặt trời phóng phủ khung f127–134 |
| S3 | 4,500 → 7,000 | 135–209 | **4 thẻ ngành hàng bật lên** tuần tự f143/150/158/165 | Tiêu đề biên tập "Hệ sinh thái sản phẩm" · F04–F07 (+ icon) | Mặt trời co về huy hiệu góc f135–144; cắt cứng f210 (phách 14) |
| S4 | 7,000 → 11,000 | 210–329 | **3 bộ đếm chạy số** f212–270, dừng ở 9,0 s | Tiêu đề biên tập "Quy mô hoạt động" · F08–F10 (số + đơn vị) | Hoà tan 8 khung f326–334 |
| S5 | 11,000 → 13,500 | 330–404 | **Gạch chân quét** dưới slogan f345–370 | F11 slogan / sứ mệnh | Cắt cứng f405 (phách 27) |
| S6 | 13,500 → 15,000 | 405–449 | **Mặt trời quay về làm nền logo**, ổn định ở f420 | F01 wordmark (thay bằng logo chính thức khi có) · F12 website | Giữ tĩnh f420–449 (1,0 s) — kết thúc |

Khung duyệt: **F0** (đầu) · **F225 = 7,500 s** (giữa, S4 đang đếm) · **F449** (cuối) — xem `review/contact_sheet.png`.

## 2. Hệ thống hình ảnh

**Bảng màu** (tạm thời — cần đối chiếu với brand guideline chính thức của Sunhouse trước khi kết xuất cuối; tôi không có nguồn xác nhận mã màu thương hiệu):

| Token | Hex | Dùng cho |
|---|---|---|
| `--sun` Sun Orange | `#F36F21` | Đĩa mặt trời, số liệu, thanh tiến độ, gạch chân |
| `--gold` Warm Gold | `#FFB547` | Điểm sáng của gradient mặt trời |
| `--ink` Ink | `#1C1B1F` | Tiêu đề, wordmark (tương phản ≥ 15:1 trên Cream) |
| `--cream` Cream | `#FFF6EC` | Nền toàn video |
| `--stone` Stone | `#6B6872` | Chữ phụ (≥ 5:1 trên Cream) |
| `--flag` QA Magenta | `#FF00C8` | **Chỉ** để đánh dấu dữ kiện chưa xác minh; không bao giờ xuất hiện trong bản cuối |

**Kiểu chữ:** Be Vietnam Pro (hỗ trợ đầy đủ dấu tiếng Việt), nhúng cục bộ — không tải từ CDN khi kết xuất.
- Wordmark/XL: 800 · 168 px · tracking +6 %
- Tiêu đề L: 800 · 72 px · Tiêu đề M: 600 · 44 px
- Số liệu: 800 · 120 px · `tabular-nums` (số không "nhảy" khi đếm)
- Thân/chú thích: 400 · 36 px (tối thiểu cho 1080p)
- Không xuống dòng (mọi khối chữ `nowrap`); nội dung dài phải rút gọn trong tệp dữ kiện, không thu nhỏ chữ.
- Vùng an toàn chữ (title-safe 10 %): x 192–1728, y 108–972.

**Quy tắc máy ảnh** (máy quay ảo 2D):
- Tối đa **một** chuyển động máy mỗi cảnh; chỉ push-in, tỉ lệ ≤ 1,03; không xoay, không lắc, không zoom-out.
- Easing: cubic-out cho vào khung, cubic in-out cho dịch chuyển; overshoot (back-out) chỉ dùng cho thẻ bật lên ở S3.
- Không có đoạn tĩnh hoàn toàn > 1 s, trừ khung giữ cuối f420–449.
- Mặt trời là **motif liên tục** xuyên suốt (mọc → hào quang → wipe → huy hiệu góc → nền logo) để giữ mạch hình.

**Quy tắc chuyển cảnh:**
- Chỉ ba loại: cắt cứng trên phách · sun-wipe (đĩa mặt trời phủ khung, 8 khung) · hoà tan 8 khung.
- Mỗi ranh giới chỉ một loại; không chuyển cảnh trong 1,5 s cuối.
- Chữ phải xuất hiện trọn vẹn ≥ 1,0 s trước khi rời khung (đủ thời gian đọc).

## 3. Gói âm thanh

**Tệp được cung cấp:** *chưa có.* Repo không có tệp âm thanh nào. Pipeline chờ:
- `assets/audio/music.wav` — nhạc nền có giấy phép, 120 BPM, ≥ 15 s, có downbeat ở 0,000 s.
- `assets/audio/vo.wav` — (tuỳ chọn) lời đọc tiếng Việt, bắt đầu ở 0,50 s.
- Bản xem trước khi chưa có nhạc dùng track **im lặng** 15,000 s (có cảnh báo). Bản cuối từ chối chạy khi thiếu nhạc, trừ khi đặt `ALLOW_SILENT=1`.

**Âm nhạc:** nhạc điện tử/acoustic ấm, sáng, 120 BPM; đỉnh "hit" ở 2,5 s và 13,5 s; fade-in 0,1 s, fade-out 14,0–15,0 s.

**Tường thuật (đề xuất, mọi token phải lấy từ tệp dữ kiện):**

| Dòng | Thời gian | Văn bản | Ngân sách |
|---|---|---|---|
| VO1 | 0,50 → 4,30 | "{F01}, thành lập năm {F02}." | ≤ 16 âm tiết |
| VO2 | 4,60 → 7,00 | "Từ {F04} đến {F07}." | ≤ 11 âm tiết |
| VO3 | 7,20 → 10,80 | "{F08} {đơn vị}, {F09} {đơn vị}, {F10} {đơn vị}." | ≤ 17 âm tiết |
| VO4 | 11,00 → 13,30 | "{F11}." | ≤ 11 âm tiết |

**Khoảng lặng (không lời):** 0,00–0,50 s (mở bằng nhạc) · khe ≥ 0,2 s giữa các dòng · 13,30–15,00 s (để logo + sting "thở"). Kết thúc ở −∞ dBFS tại 15,000 s.

**Mix:** nhạc bị duck dưới VO (sidechain, ratio 6:1) · chuẩn hoá **−14 LUFS tích hợp, true peak ≤ −1 dBTP** · 48 kHz · cắt/đệm chính xác 15,000 s.

**Điểm đồng bộ:**

| Thời điểm | Khung | Sự kiện hình | Sự kiện âm |
|---|---|---|---|
| 0,000 | 0 | Mặt trời bắt đầu mọc | Downbeat + riser nhẹ |
| 1,667 | 50 | Mặt trời tới giữa khung | Đỉnh riser |
| 2,000 | 60 | Cắt sang S2 | Phách 4 |
| 2,500 | 75 | Wordmark chạm đích | **Hit chính** |
| 4,233–4,500 | 127–135 | Sun-wipe | Whoosh |
| 4,767 / 5,000 / 5,267 / 5,500 | 143/150/158/165 | Thẻ bật lên | 4 tick (móc đơn 120 BPM) |
| 7,000 | 210 | Cắt sang S4 | Phách 14 |
| 9,000 | 270 | Bộ đếm cuối dừng | Tick chốt |
| 11,000 | 330 | Slogan hoà tan vào | Phách 22 |
| 11,500–12,333 | 345–370 | Gạch chân quét | Riser ngắn |
| 13,500 | 405 | Cắt sang end card | **Hit kết** (phách 27) |
| 14,000 | 420 | Logo ổn định | Sting, bắt đầu fade-out |

## 4. Bản kê khai tài sản

| Tài sản | Dùng ở | Nguồn | Giấy phép | Trạng thái |
|---|---|---|---|---|
| Be Vietnam Pro 400/600/800 (woff2, subset vietnamese + latin) | Toàn bộ chữ | npm `@fontsource/be-vietnam-pro@5.2.5` (gốc: Google Fonts) | SIL OFL 1.1 — bản giấy phép trong `node_modules/@fontsource/be-vietnam-pro/LICENSE` | ✅ đã khoá phiên bản |
| Đĩa mặt trời, đường chân trời, thanh tiến độ, gạch chân | S1–S6 | Vẽ bằng CSS trong `src/scene.html` | Tự làm (nội bộ) | ✅ |
| Icon ngành hàng (nồi cơm, chảo, quạt, giọt nước, generic) | S3 | SVG vẽ tay trong `src/scene.html` | Tự làm (nội bộ) | ✅ — icon nào hiển thị do trường `icon` của F04–F07 quyết định |
| Logo Sunhouse chính thức | S6 | Phải lấy từ bộ nhận diện thương hiệu (SVG/PNG) | Nhãn hiệu của chủ sở hữu — cần xác nhận quyền sử dụng | ❌ **chưa có**; tạm dùng wordmark dàn chữ từ F01 |
| Nhạc nền | Toàn bộ | Chưa chọn (stock có giấy phép hoặc đặt sáng tác) | Phải lưu chứng từ giấy phép kèm repo | ❌ chưa có |
| Lời đọc (VO) | Toàn bộ | Chưa thu (giọng thật hoặc TTS có quyền thương mại) | Phải ghi rõ nguồn/điều khoản | ❌ chưa có (tuỳ chọn) |
| Dữ kiện F01–F12 | Mọi chữ/số mang thông tin | Tệp tại `FACTS_PATH` — mỗi mục có `source_title`, `source_url`, `retrieved` | — | ❌ chưa có |
| DejaVu Sans Bold | **Chỉ** nhãn của contact sheet duyệt, không có trong video | Font hệ thống | Bitstream Vera License | ✅ |

Công cụ (không phải tài sản trong video): Playwright 1.56.1 (Apache-2.0) + Chromium headless; FFmpeg 6.1.1 với libx264 (GPL) — chỉ dùng để mã hoá, không phân phối kèm.

Chữ biên tập (không phải tuyên bố thực tế, cần duyệt câu chữ): "Hệ sinh thái sản phẩm", "Quy mô hoạt động", tiền tố "Thành lập năm".

## 5. Trình kết xuất & lệnh

**Lựa chọn:** HTML/CSS tất định + Playwright (Chromium headless) chụp từng khung → FFmpeg mã hoá.
Lý do: kiểu chữ tiếng Việt chuẩn xác, mỗi khung là hàm thuần của số khung (`window.__seek(f)`) nên kết xuất lặp lại được bit-cho-bit, kiểm tra bố cục chạy ngay trong DOM, và mọi thứ chạy cục bộ không cần dịch vụ ngoài.

```bash
cd sunhouse-intro
npm ci                                   # font + playwright (Chromium có sẵn ở /opt/pw-browsers)

# Ảnh duyệt (đã chạy): khung đầu/giữa/cuối
npm run stills                           # = node scripts/render.mjs --frames 0,225,449 --out out/stills

# Xem trước độ phân giải thấp: 960×540, render 15 fps rồi nhân đôi khung lên container 30 fps
FACTS_PATH=path/to/facts.json npm run preview
#   = node scripts/render.mjs --all --scale 0.5 --step 2 --out out/preview_frames
#     && bash scripts/encode.sh preview          → out/preview_960x540.mp4

# MP4 cuối 1080p30 (dừng nếu còn dữ kiện chưa xác minh hoặc lỗi bố cục)
FACTS_PATH=path/to/facts.json npm run final
#   = node scripts/render.mjs --all --scale 1 --out out/frames --strict-facts
#     && bash scripts/encode.sh final            → out/sunhouse_intro_15s_1080p30.mp4

# Kiểm tra chấp nhận
npm run qa                               # = node scripts/qa.mjs out/sunhouse_intro_15s_1080p30.mp4
```

Chỉ kiểm tra bố cục toàn bộ 450 khung, không ghi ảnh: `node scripts/render.mjs --all --check-only`.

## 6. Kiểm tra chấp nhận (`scripts/qa.mjs` + `out/layout_report.json`)

| Nhóm | Kiểm tra | Ngưỡng đạt |
|---|---|---|
| **Khung trống** | `signalstats` từng khung: YMAX − YMIN | ≥ 12 ở **mọi** khung trong 450 khung (khung 0 đã có hình) |
| **Tràn chữ** | Trong DOM, mỗi khung: `scrollWidth ≤ clientWidth` cho mọi `[data-text]`; khung bao chữ nằm trong title-safe 10 % | 0 vi phạm trên cả 450 khung ở scale 1 |
| **Dữ kiện** | Không còn mục nào chưa `verified` (không còn ô magenta) | 0 mục thiếu; `--strict-facts` dừng kết xuất nếu vi phạm |
| **Nhất quán khung** | Đếm khung (`ffprobe -count_frames`) · fps r = avg = 30/1 · phát hiện scene-cut (`scene > 0,30`) chỉ ở f60/135/210/405 ±1 · `freezedetect` không có đoạn tĩnh > 1 s trước f419 · PSNR giữa MP4 và PNG gốc | đúng 450 · CFR · không cắt ngoài kế hoạch · không đứng hình ngoài khung giữ cuối · PSNR ≥ 38 dB |
| **Thời lượng âm thanh** | Track AAC 48 kHz; thời lượng audio; `ebur128` | 15,000 s ± 0,05 · −15…−13 LUFS · true peak ≤ −1 dBTP |
| **Kích thước xuất** | Độ phân giải, codec, pix_fmt, thời lượng container, dung lượng | 1920×1080 · h264/yuv420p · 15,000 s ± 1 khung · ≤ 30 MB |

Script QA đã được chạy thử trên clip test-pattern tổng hợp để xác nhận mọi phép đo hoạt động; nó chưa chạy trên video thật vì chưa có kết xuất đầy đủ.
