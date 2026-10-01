# SUNHOUSE — Video giới thiệu tập đoàn 15 giây

Thông số: **1920×1080, 30 fps CFR, đúng 450 khung (0–449), 15,000 s**, H.264 High yuv420p + AAC 48 kHz stereo.
Mọi chữ trên màn hình được lấy từ `facts/sunhouse_facts.json` qua thuộc tính `data-fact`. QA sẽ báo lỗi nếu có chữ không gắn với một fact.

> **Nguồn sự thật:** yêu cầu ghi `[FACTS PATH]` nhưng chưa điền đường dẫn. Tôi đã tạo `facts/sunhouse_facts.json` từ
> https://sunhouse.com.vn/ và https://sunhouse.com.vn/gioi-thieu (lấy ngày 01/10/2026, có trích nguyên văn cho từng fact).
> Nếu anh/chị có tệp facts chính thức, chỉ cần thay tệp này. Bố cục không phải sửa.

---

## 1. Danh sách cảnh quay

| # | Bắt đầu – Kết thúc | Khung | Hành động tiêu điểm | Facts dùng |
|---|---|---|---|---|
| S1 | 0,00 – 2,50 s | 0–74 | **Mặt trời mọc lên khỏi đường chân trời**, wordmark SUNHOUSE trồi lên (0,6 s), dòng "TẬP ĐOÀN SUNHOUSE" (1,0 s) | brand_name, group_name |
| S2 | 2,50 – 5,00 s | 75–149 | **Đường thời gian tự vẽ từ trái sang phải** (2,7–3,7 s), ba mốc 2000 → 2004 → 2010 bật lên lần lượt | since_heading, y2000/2004/2010 (+ caption), src_about |
| S3 | 5,00 – 9,00 s | 150–269 | **Bốn bộ đếm số chạy lên**, chạm đúng giá trị trước 7,0 s, sau đó giữ 2,0 s để người xem kịp đọc | stat_products / pos / plants / members, src_about |
| S4 | 9,00 – 12,00 s | 270–359 | **Sáu ô danh mục xuất hiện so le** (cách nhau 0,12 s), ổn định hết từ 10,6 s | cat_heading, cat_1…cat_6, src_home |
| S5 | 12,00 – 15,00 s | 360–449 | **Khóa logo + tagline**. Mọi thứ đứng yên từ 13,5 s, khung cuối hoàn toàn tĩnh | brand_name, tagline, url, hotline |

Khung xem duyệt: **đầu = f0**, **giữa = f225 (7,5 s, S3 đã ổn định)**, **cuối = f449**.

## 2. Hệ thống hình ảnh

**Bảng màu (TẠM THỜI, cần đối chiếu với tài liệu "Bản sắc nhận diện" của SUNHOUSE):**

| Token | Hex | Dùng cho |
|---|---|---|
| `--sun` | `#F37021` | điểm nhấn, mặt trời, số năm, thanh wipe |
| `--sun-deep` | `#C9481A` | nền S3/S5. Chữ trắng trên nền này đạt 4,75:1 |
| `--cream` | `#FFF6EC` | nền S1/S2/S4 |
| `--ink` | `#1E1B18` | chữ chính |
| `--muted` | `#6B6159` | chữ phụ, dòng nguồn |

**Kiểu chữ:** Be Vietnam Pro (SIL OFL 1.1) gồm 400 / 600 / 800, có đủ bộ ký tự tiếng Việt.
Thang cỡ chữ: 150 (wordmark) · 168 (số liệu) · 112 (năm) · 88–96 (tiêu đề) · 52 (tagline) · 34–44 (nhãn) · 22 (dòng nguồn, nhỏ nhất).
Chữ không xuống dòng ngoài ý muốn: mỗi khối có độ rộng cố định, `nowrap` (trừ caption và tên danh mục, tối đa 2 dòng).

**Quy tắc máy ảnh (2D, ảo):**
- Mỗi shot chỉ có một chuyển động: đẩy vào (push-in) tuyến tính, tỉ lệ 1,00 → 1,03. Không xoay, không lia, không rung.
- S5 khóa máy từ 13,5 s để khung cuối đứng yên.
- Vùng an toàn chữ là 5% (x 96–1824, y 54–1026), tính *sau* khi đã áp push-in.

**Quy tắc chuyển cảnh:**
- Chỉ dùng **một** kiểu chuyển cảnh: tấm `--sun` quét ngang từ trái sang phải trong 12 khung (0,4 s), che kín khung hình đúng tại điểm cắt.
- 4 điểm cắt: 2,5 / 5,0 / 9,0 / 12,0 s, đều rơi đúng phách nhạc 120 BPM.
- Không dùng dissolve, không chèn khung trống giữa hai cảnh.

## 3. Âm thanh

| Hạng mục | Kế hoạch |
|---|---|
| Tệp được cung cấp | **Chưa có.** Chưa nhận nhạc, VO hay SFX nào. |
| Âm nhạc | Tôi tự tổng hợp bằng `ffmpeg aevalsrc` (`scripts/music.sh`), nên không phát sinh giấy phép. 120 BPM, vòng hợp âm C–Am–F–G (mỗi ô nhịp 2 s), kick nhẹ mỗi phách. Có thể thay bằng nhạc có license nếu anh/chị muốn. |
| Tường thuật (VO) | **Không có** ở bản này. Video kể chuyện hoàn toàn bằng chữ. Nếu cần VO, kịch bản ~30 từ vừa 13 s: *"SUNHOUSE. Từ năm 2000. Một nghìn loại sản phẩm, sáu mươi nghìn điểm bán, sáu nhà máy, bảy công ty thành viên. Thương hiệu quốc gia, chuẩn quốc tế."* Tất cả đều lấy từ facts. |
| Khoảng lặng | Fade-in 0,0–0,3 s. Fade-out 13,5–15,0 s, về im lặng tuyệt đối tại 15,000 s. |
| Điểm đồng bộ | Tiếng chime (C6, decay 0,4 s) tại 2,5 / 5,0 / 9,0 / 12,0 s, trùng tâm thanh wipe. Kick trùng mỗi phách (15 khung). Bộ đếm S3 dừng ở 7,0 s, đúng phách. |
| Chuẩn âm lượng | −16 LUFS integrated (±1,5), true peak ≤ −1,0 dBTP. WAV 48 kHz, cắt chính xác 720.000 mẫu (đúng 15,000 s). |

## 4. Danh mục tài sản

| Tài sản | Nguồn | Giấy phép |
|---|---|---|
| Be Vietnam Pro 400/600/800 (woff2, subset latin + vietnamese) | npm `@fontsource/be-vietnam-pro@5.3.0`, gốc từ github.com/bettergui/BeVietnamPro | SIL OFL 1.1, xem `assets/fonts/OFL.txt` |
| Nội dung chữ / số liệu | sunhouse.com.vn, sunhouse.com.vn/gioi-thieu | Thông tin công khai của SUNHOUSE. Ghi nguồn trên màn hình. |
| Tên & wordmark "SUNHOUSE" | Đang dựng bằng chữ Be Vietnam Pro, **không phải logo chính thức** | Nhãn hiệu thuộc SUNHOUSE. **Cần khách hàng cấp tệp logo (SVG)** từ bộ "Bản sắc nhận diện" để thay. |
| Mặt trời, đường chân trời, ô danh mục, thanh wipe | Tự dựng bằng CSS | Sản phẩm của dự án |
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

# Bản cuối 1920x1080 @30fps
bash scripts/final.sh            # -> out/sunhouse_15s_1080p30.mp4

# QA bản cuối
bash scripts/qa_media.sh out/sunhouse_15s_1080p30.mp4
```

Lệnh FFmpeg của bản cuối (trong `scripts/final.sh`):
`ffmpeg -framerate 30 -i out/frames/f%05d.png -i out/audio/music.wav -c:v libx264 -profile:v high -preset slow -crf 18 -pix_fmt yuv420p -r 30 -g 30 -c:a aac -b:a 192k -ar 48000 -ac 2 -t 15 -movflags +faststart out/sunhouse_15s_1080p30.mp4`

## 6. Kiểm tra nghiệm thu

| Hạng mục | Kiểm tra | Ngưỡng đạt | Script |
|---|---|---|---|
| Khung trống | Biên độ luma YMAX−YMIN < 12 tính là khung phẳng. Chạy thêm `blackdetect`. Trên DOM: mỗi khung có đúng 1 cảnh hiển thị. | 0 khung phẳng, 0 đoạn đen, 0 khung thiếu hoặc chồng cảnh | qa_media.sh, qa.mjs |
| Tràn văn bản | `scrollWidth/scrollHeight` không vượt hộp chữ. Hộp bao glyph nằm trong vùng an toàn 5% (đo sau camera). Kiểm tra ở **cả 450 khung**. | 0 vi phạm | qa.mjs |
| Gắn với facts | Mọi `.txt` đang hiển thị phải có `data-fact` hợp lệ. Khi đã ổn định (opacity > 0,99), chữ phải khớp đúng `display`. Bộ đếm phải đúng giá trị tại f210 và f269. | 0 vi phạm | qa.mjs |
| Font | Be Vietnam Pro 400/600/800 đã nạp, vẽ được "ẬỐẨỆđ" | đạt | qa.mjs |
| Nhất quán khung | 30/1 CFR (r & avg), đúng 450 khung. f225 render 2 lần phải giống hệt từng byte. Khung 0/225/449 của MP4 so với ảnh đã duyệt: PSNR ≥ 38 dB. | đạt | qa.mjs, qa_media.sh |
| Thời lượng âm thanh | AAC 48 kHz stereo, 15,000 s ± 1 khung (33 ms). −16 ±1,5 LUFS. TP ≤ −1,0 dBTP. | đạt | qa_media.sh |
| Kích thước xuất | 1920×1080, h264, yuv420p, tệp ≤ 25 MiB, thời lượng video 15,000 ± 1/30 s | đạt | qa_media.sh |

Trạng thái hiện tại: `qa:dom` **0 lỗi / 450 khung**. `qa_media.sh` đã được tự kiểm thử trên clip tổng hợp: bắt đúng loudness sai, khung phẳng và khung lệch so với ảnh duyệt. Chưa chạy trên MP4 thật vì chưa render bản đầy đủ.

## Điểm cần anh/chị quyết định
1. Đường dẫn facts chính thức (thay cho `[FACTS PATH]`), hoặc duyệt tệp facts đã tạo.
2. "1.000 loại sản phẩm" (trang Giới thiệu) hay "hơn 500 nhóm sản phẩm" (trang chủ)? Hai trang đang ghi khác nhau.
3. Logo SVG và mã màu chính thức (bảng màu trên đang là tạm).
4. Có cần VO / nhạc có license không, hay giữ nhạc tự tổng hợp.
5. Tỉ lệ khung: 16:9 hay cần thêm bản 9:16.
