# SUNHOUSE — Video giới thiệu tập đoàn 15 giây

Thông số: **1920×1080, 30 fps CFR, đúng 450 khung (0–449), 15,000 s**, H.264 High yuv420p + AAC 48 kHz stereo.
Mọi chữ trên màn hình được lấy từ `facts/sunhouse_facts.json` qua thuộc tính `data-fact`. QA sẽ báo lỗi nếu có chữ không gắn với một fact.

> **Nguồn sự thật (đã duyệt):** `facts/sunhouse_facts.json`, lấy từ https://sunhouse.com.vn/ và https://sunhouse.com.vn/gioi-thieu
> ngày 01/10/2026, mỗi fact có trích nguyên văn. Con số sản phẩm dùng **1.000 loại sản phẩm** (đã chốt).
>
> **Quyết định đã chốt:** duyệt facts · 1.000 · **có lời đọc** · nhạc tự tạo · **chỉ 16:9** · logo do khách hàng cung cấp.

---

## 1. Danh sách cảnh quay

| # | Bắt đầu – Kết thúc | Khung | Hành động tiêu điểm | Facts dùng |
|---|---|---|---|---|
| S1 | 0,00 – 2,50 s | 0–74 | **Logo SUNHOUSE trồi lên từ sau đường chân trời** như mặt trời mọc (0–1,1 s; khung 0 đã thấy đỉnh logo), dòng "TẬP ĐOÀN SUNHOUSE" (0,9 s) | logo, group_name |
| S2 | 2,50 – 5,00 s | 75–149 | **Đường thời gian tự vẽ từ trái sang phải** (2,7–3,7 s), ba mốc 2000 → 2004 → 2010 bật lên lần lượt | since_heading, y2000/2004/2010 (+ caption), src_about |
| S3 | 5,00 – 9,00 s | 150–269 | **Bốn bộ đếm số chạy lên** (ô đầu xuất hiện ngay sau vạch wipe), chạm đúng giá trị trước 7,0 s, sau đó giữ 2,0 s để người xem kịp đọc | stat_products / pos / plants / members, src_about |
| S4 | 9,00 – 12,00 s | 270–359 | **Sáu ô danh mục xuất hiện so le** (cách nhau 0,12 s), ổn định hết từ 10,6 s | cat_heading, cat_1…cat_6, src_home |
| S5 | 12,00 – 15,00 s | 360–449 | **Khóa logo + tagline**. Mọi thứ đứng yên từ 13,5 s, khung cuối hoàn toàn tĩnh | logo, tagline, url, hotline |

Khung xem duyệt: **đầu = f0**, **giữa = f225 (7,5 s, S3 đã ổn định)**, **cuối = f449**.

## 2. Hệ thống hình ảnh

**Bảng màu (lấy mẫu trực tiếp từ logo khách hàng cung cấp):**

| Token | Hex | Dùng cho | Tương phản |
|---|---|---|---|
| `--red` | `#DB2128` | đỏ thương hiệu: số năm, chỉ số ô, vạch wipe, gạch dưới | 4,6:1 trên nền paper |
| `--teal` | `#0D7182` | xanh thương hiệu: nền S3, tagline | chữ trắng 5,7:1 |
| `--paper` | `#F5F8F9` | nền sáng S1/S2/S4/S5 (để logo nổi rõ khiên xanh và nhãn đỏ) | |
| `--ink` | `#13252B` | chữ chính | 14,8:1 |
| `--muted` | `#5A6B70` | chữ phụ, dòng nguồn | 5,2:1 |

**Kiểu chữ:** Be Vietnam Pro (SIL OFL 1.1) gồm 400 / 600 / 800, có đủ bộ ký tự tiếng Việt.
Thang cỡ chữ: 150 (wordmark) · 168 (số liệu) · 112 (năm) · 88–96 (tiêu đề) · 52 (tagline) · 34–44 (nhãn) · 22 (dòng nguồn, nhỏ nhất).
Chữ không xuống dòng ngoài ý muốn: mỗi khối có độ rộng cố định, `nowrap` (trừ caption và tên danh mục, tối đa 2 dòng).

**Quy tắc máy ảnh (2D, ảo):**
- Mỗi shot chỉ có một chuyển động: đẩy vào (push-in) tuyến tính, tỉ lệ 1,00 → 1,03. Không xoay, không lia, không rung.
- S5 khóa máy từ 13,5 s để khung cuối đứng yên.
- Vùng an toàn chữ là 5% (x 96–1824, y 54–1026), tính *sau* khi đã áp push-in.

**Quy tắc chuyển cảnh:**
- Chỉ dùng **một** kiểu chuyển cảnh: **vạch đỏ 24 px quét ngang trái → phải trong 12 khung (0,4 s)**, lộ cảnh mới phía sau vạch. Vạch nằm đúng giữa màn hình tại khung cắt. Kiểu cũ (tấm màu phủ kín) bị bỏ vì tạo ra khung trơn một màu.
- 4 điểm cắt: 2,5 / 5,0 / 9,0 / 12,0 s, đều rơi đúng phách nhạc 120 BPM.
- Không dùng dissolve, không chèn khung trống giữa hai cảnh.

## 3. Âm thanh

| Hạng mục | Kế hoạch |
|---|---|
| Tệp được cung cấp | Chưa có tệp âm thanh. Giọng đọc chính thức cần đặt vào `vo/final/vo1.wav … vo5.wav` (xem bên dưới). |
| Âm nhạc | Tự tổng hợp bằng `ffmpeg aevalsrc` (`scripts/music.sh`), không cần giấy phép. 120 BPM, vòng C–Am–F–G, kick mỗi phách. Tự động giảm âm lượng (ducking, sidechain 6:1) khi có lời đọc. |
| Lời đọc (VO) | 5 câu, cue sheet trong `vo/vo_script.json`, mỗi câu gắn với id trong facts. `scripts/mix.py` cắt khoảng lặng, đặt câu đúng mốc và **báo lỗi nếu câu nào dài quá cửa sổ thời gian**. |
| Khoảng lặng | Fade-in nhạc 0–0,3 s. Câu đầu bắt đầu ở 0,4 s. Không có lời đọc ở 2,4–2,7, 4,9–5,3 và 11,9–12,3 s (các điểm cắt). Fade-out 13,5–15,0 s, im lặng tuyệt đối tại 15,000 s. |
| Điểm đồng bộ | Chime tại 2,5 / 5,0 / 9,0 / 12,0 s, trùng tâm vạch wipe. Bộ đếm S3 dừng ở 7,0 s, đúng phách. Mỗi câu VO bắt đầu sau điểm cắt 0,2–0,3 s. |
| Chuẩn âm lượng | Bản mix −16 LUFS, true peak ≤ −1,0 dBTP, WAV 48 kHz cắt đúng 720.000 mẫu. |

**Cue sheet lời đọc** (thời lượng đo bằng giọng nháp espeak-ng, tốc độ 165 wpm):

| Cue | Cửa sổ | Lời | Facts | Giọng nháp |
|---|---|---|---|---|
| vo1 | 0,40–2,40 s | Tập đoàn SUNHOUSE. | group_name | 0,97 s |
| vo2 | 2,70–4,90 s | Hành trình từ năm hai nghìn. | since_heading, y2000 | 1,35 s |
| vo3 | 5,30–8,90 s | Một nghìn loại sản phẩm, sáu mươi nghìn điểm bán, sáu nhà máy. | stat_products/pos/plants | 3,36 s (sát cửa sổ) |
| vo4 | 9,30–11,90 s | Điện gia dụng, thiết bị nhà bếp. | cat_1, cat_3 | 1,82 s |
| vo5 | 12,30–14,60 s | Thương hiệu quốc gia, chuẩn quốc tế. | tagline | 2,10 s |

Ghi chú: vo3 không đọc "bảy công ty thành viên", vì câu đầy đủ đo được 5,1 s, dài hơn cửa sổ 4,4 s. Con số này vẫn hiện trên màn hình.

**Giọng nháp ≠ giọng giao hàng.** Container chỉ ra được npm/PyPI, nên không có TTS tiếng Việt chất lượng cao cục bộ. Giọng nháp (`scripts/scratch_vo.py`, espeak-ng) chỉ dùng để canh thời lượng. `final.sh` **từ chối xuất** nếu thiếu `vo/final/*.wav`. Đặt `ALLOW_SCRATCH_VO=1` thì xuất bản thử, tên tệp có hậu tố `_SCRATCHVO`.

## 4. Danh mục tài sản

| Tài sản | Nguồn | Giấy phép |
|---|---|---|
| Be Vietnam Pro 400/600/800 (woff2, subset latin + vietnamese) | npm `@fontsource/be-vietnam-pro@5.3.0`, gốc từ github.com/bettergui/BeVietnamPro | SIL OFL 1.1, xem `assets/fonts/OFL.txt` |
| Nội dung chữ / số liệu | sunhouse.com.vn, sunhouse.com.vn/gioi-thieu | Thông tin công khai của SUNHOUSE. Ghi nguồn trên màn hình. |
| Logo SUNHOUSE® `assets/brand/sunhouse_logo.png` (600×318 PNG RGBA, sha256 `b1c2e293c7bd8608…`) | Khách hàng cung cấp trong buổi review (01/10/2026) | Nhãn hiệu đăng ký của SUNHOUSE, dùng theo yêu cầu của chủ thương hiệu. Hiển thị đúng 600 px, không phóng to. Nếu có bản SVG/2× thì nên thay. |
| Đường chân trời, ô danh mục, vạch wipe | Tự dựng bằng CSS | Sản phẩm của dự án |
| Lời đọc giao hàng `vo/final/*.wav` | **Chờ cung cấp** | Ghi giấy phép khi có (hợp đồng voice actor / điều khoản dịch vụ TTS) |
| Giọng nháp | espeak-ng qua PyPI `espeakng-loader` | GPL-3.0. Chỉ dùng nội bộ, không nằm trong bản giao |
| Nhạc nền + chime | Tự tổng hợp (`scripts/music.sh`) | Sản phẩm của dự án |
| Playwright 1.56.1 + Chromium, FFmpeg | Công cụ dựng, không nằm trong video | Apache-2.0 / BSD / LGPL |

Không dùng ảnh sản phẩm hay stock footage nào. Ảnh sản phẩm thật cần khách hàng cung cấp.

## 5. Trình kết xuất & lệnh

**Lựa chọn:** HTML/CSS + JS tất định (mỗi khung là hàm thuần của `t = frame/30`, không dùng CSS transition hay requestAnimationFrame). Chụp từng khung bằng **Playwright/Chromium**, ghép bằng **FFmpeg**.
Lý do chọn: chữ tiếng Việt hiển thị chuẩn, kiểm tra được tràn chữ ngay trên DOM, và chụp lại cùng một khung luôn ra kết quả giống hệt nhau từng byte.

```bash
cd sunhouse-15s
npm install                      # Playwright 1.56.1 (cần Chromium; nếu thiếu: npx playwright install chromium)

# Ảnh duyệt (đầu / giữa / cuối) + contact sheet
npm run stills                   # -> out/stills/f00000.png f00225.png f00449.png, contact_first_mid_last.png

# Kiểm tra DOM (450 khung, không render)
npm run qa:dom

# Preview độ phân giải thấp 960x540 @30fps, x264 ultrafast, kèm nhạc
bash scripts/preview.sh          # -> out/sunhouse_15s_preview_540p30.mp4

# Bản cuối 1920x1080 @30fps (cần vo/final/vo1..vo5.wav)
bash scripts/final.sh            # -> out/sunhouse_15s_1080p30.mp4
ALLOW_SCRATCH_VO=1 bash scripts/final.sh   # bản thử với giọng nháp -> out/sunhouse_15s_1080p30_SCRATCHVO.mp4

# QA bản cuối
bash scripts/qa_media.sh out/sunhouse_15s_1080p30.mp4
```

Lệnh FFmpeg của bản cuối (trong `scripts/final.sh`):
`ffmpeg -framerate 30 -i out/frames/f%05d.png -i out/audio/mix.wav -c:v libx264 -profile:v high -preset slow -crf 18 -pix_fmt yuv420p -r 30 -g 30 -c:a aac -b:a 192k -ar 48000 -ac 2 -t 15 -movflags +faststart out/sunhouse_15s_1080p30.mp4`

## 6. Kiểm tra nghiệm thu

| Hạng mục | Kiểm tra | Ngưỡng đạt | Script |
|---|---|---|---|
| Khung trống | Biên độ luma YMAX−YMIN < 12 tính là khung phẳng. Chạy thêm `blackdetect`. Trên DOM: mỗi khung có 1 cảnh (2 cảnh trong cửa sổ wipe); vạch wipe nằm giữa màn hình tại khung cắt. | 0 khung phẳng, 0 đoạn đen | qa_media.sh, qa.mjs |
| Tràn văn bản | `scrollWidth/scrollHeight` không vượt hộp chữ. Hộp bao glyph nằm trong vùng an toàn 5% (đo sau camera). Kiểm tra ở **cả 450 khung**. | 0 vi phạm | qa.mjs |
| Gắn với facts | Mọi `.txt` đang hiển thị phải có `data-fact` hợp lệ. Khi đã ổn định (opacity > 0,99), chữ phải khớp đúng `display`. Bộ đếm phải đúng giá trị tại f210 và f269. | 0 vi phạm | qa.mjs |
| Font | Be Vietnam Pro 400/600/800 đã nạp, vẽ được "ẬỐẨỆđ" | đạt | qa.mjs |
| Nhất quán khung | 30/1 CFR (r & avg), đúng 450 khung. f225 render 2 lần phải giống hệt từng byte. Khung 0/225/449 của MP4 so với ảnh đã duyệt: PSNR ≥ 38 dB. | đạt | qa.mjs, qa_media.sh |
| Thời lượng âm thanh | AAC 48 kHz stereo, 15,000 s ± 1 khung (33 ms). −16 ±1,5 LUFS. TP ≤ −1,0 dBTP. Mỗi cue VO nằm trong cửa sổ của nó. | đạt | qa_media.sh, mix.py |
| Kích thước xuất | 1920×1080, h264, yuv420p, tệp ≤ 25 MiB, thời lượng video 15,000 ± 1/30 s | đạt | qa_media.sh |

Trạng thái hiện tại (01/10/2026):
- `qa:dom` **0 lỗi / 450 khung**.
- Bản thử 1080p với giọng nháp (`_SCRATCHVO`) **qua toàn bộ `qa_media.sh`**: 1920×1080, 30/1, 450 khung, 15,000 s, −16,0 LUFS, TP −1,4 dBTP, 0 khung phẳng, khung 0/225/449 khớp ảnh duyệt với PSNR ≥ 39 dB, tệp 1,9 MiB.
- Lỗi QA đã bắt và sửa: (1) tấm wipe phủ kín tạo khung trơn → đổi sang vạch wipe; (2) f155–157 chỉ có nền xanh sau wipe vào S3 → cho ô số liệu hiện sớm hơn.
- **Còn chờ:** giọng đọc thật trong `vo/final/`.