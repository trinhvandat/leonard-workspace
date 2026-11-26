# PRD — Leonard's Garden (Digital Garden & Portfolio)

- **Ngày tạo:** 2026-11-21
- **Chủ sở hữu:** Leonard — Fullstack Engineer (backend-heavy) & Engineering Manager
- **Trạng thái:** Draft — Giai đoạn 1 · Thiết kế UI đã chốt (prototype artifact), sẵn sàng vào bước triển khai
- **Design tham chiếu:** Artifact "Leonard's Garden" — prototype đầy đủ các màn hình, đã chốt thẩm mỹ & layout
  - URL: https://claude.ai/artifact/ABRSw9FFi9Z68kKWUioQB1
  - Phủ: `/`, `/notes` (có filter maturity + topic + author view), `/notes/[slug]` (2 cột: cột đọc ~680px + rail meta/mục lục/connected), `/topics`, `/topics/[tag]`, `/about` (CV + contact), cùng các case: empty state, 404, draft ẩn, backlinks 2 chiều.

---

## 1. Mục tiêu & bối cảnh

Một website cá nhân vừa là **digital garden** (vườn kiến thức lớn dần theo thời gian) vừa là **portfolio**.

Thứ tự ưu tiên:

1. **Portfolio cho HR & freelance/contract** — gây ấn tượng năng lực, là nơi gửi khi nộp CV hoặc đi bid dự án. *(ưu tiên cao nhất)*
2. **Blog/kiến thức cho người mới học software** — nội dung có cấu trúc, SEO tốt để người học tìm thấy.
3. **Ôn tập cá nhân (second brain)** — tổ chức kiến thức để chính tác giả tra cứu lại. *(để Giai đoạn 2)*

### Non-goals (Giai đoạn 1)
- Không authentication / login.
- Không backend, không database.
- Không comment, không search server-side, không CMS.
- Không khu riêng tư (notes private có auth) — để Giai đoạn 2.

---

## 2. Chiến lược 2 giai đoạn

### Giai đoạn 1 — Digital garden công khai (phạm vi của PRD này)
Site tĩnh, viết note bằng Markdown/MDX trong repo, build & deploy. Phủ ưu tiên #1 và #2.

### Giai đoạn 2 — Khu riêng tư (ngoài phạm vi, ghi nhận để không cản đường)
Khu vực có login (JWT) + **Spring Boot + PostgreSQL** để khoe thế mạnh backend; notes cá nhân lưu DB, sửa trên web. Thiết kế Giai đoạn 1 phải để chừa đường cho việc gắn thêm app có auth sau này (dùng Next.js App Router nên thêm route/API về sau thuận lợi).

---

## 3. Tech stack (Giai đoạn 1)

| Thành phần | Lựa chọn | Lý do |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Chuẩn portfolio, SEO tốt (SSG/metadata), dễ mở rộng sang app có auth ở GĐ2 |
| Nội dung | **MDX + content layer** (Velite hoặc Content Collections) | Note = file `.mdx` + frontmatter; build-time đọc thành dữ liệu type-safe, tự sinh list/topic/backlink |
| Styling | **CSS tokens lấy từ mockup** | Giữ nguyên thẩm mỹ đã chốt; dark mode có sẵn |
| Deploy | **Vercel** (free tier) | Luôn online, miễn phí, gắn domain riêng sau |

### Hệ thống thiết kế (chốt từ mockup "Leonard's Garden")
- **Màu:** paper ấm làm nền; accent `--green` (#1f9e6b), `--coral` (#f0603f), `--berry` (#7c5cf0); đầy đủ biến dark mode.
- **Font:** Bricolage Grotesque (display) · Newsreader (body serif) · JetBrains Mono (meta/code).
- **Dark mode:** theo `prefers-color-scheme` + toggle lưu `localStorage`.
- **Chi tiết nhận diện:** nền chấm bi (dot grid), icon "mầm cây", gạch chân vẽ tay cho từ nhấn.

---

## 4. Mô hình nội dung — trái tim của garden

Mỗi note là một file `.mdx` với frontmatter:

```yaml
title: "Monolith → microservices: the patterns that held up"
slug: monolith-to-microservices        # tùy chọn; mặc định suy từ tên file
maturity: evergreen                     # seedling | budding | evergreen
topics: [architecture, microservices]
planted: 2026-08-01                     # ngày tạo
tended: 2026-11-15                      # lần cập nhật gần nhất
confidence: high                        # low | medium | high
citations:                              # nguồn tham khảo (để đạt "100% cited")
  - "https://..."
draft: false                            # true = ẩn khỏi public (giữ ý thô riêng)
```

### Quy tắc dẫn xuất (build-time)
- **Độ chín (maturity):** 🌱 seedling → budding → evergreen; hiển thị nhãn + icon ở mỗi note.
- **Backlinks:** liên kết giữa note bằng cú pháp `[[wiki-link]]`; build dựng được "note này nối tới / được nối từ".
- **Topics:** gom tự động từ `topics[]` → trang `/topics/[tag]` kèm số lượng.
- **Draft:** `draft: true` ⇒ không xuất hiện ở bản public (cách đơn giản giữ "ý thô" riêng mà chưa cần auth).
- **Validation:** frontmatter phải hợp lệ theo schema; build **fail** nếu thiếu trường bắt buộc hoặc `maturity`/`confidence` sai giá trị.

---

## 5. Cấu trúc trang

| Route | Mô tả |
|---|---|
| `/` | Trang chủ đúng mockup: hero, "What's growing" (note mới/nổi bật), aside (trích 1 note), topics, stats, CTA freelance |
| `/notes` | Danh sách tất cả note; lọc theo độ chín & topic |
| `/notes/[slug]` | Đọc 1 note: nội dung MDX, metadata (độ chín/confidence/ngày), citations, backlinks |
| `/topics` | Danh sách chủ đề + số note |
| `/topics/[tag]` | Các note thuộc một chủ đề |
| `/about` | Hồ sơ + kinh nghiệm/CV + liên hệ freelance — "landing cho HR" |

- **Course / series:** ở GĐ1 chỉ là một topic đặc biệt hoặc chuỗi note liên kết với nhau — không cần cơ chế riêng (YAGNI). Có thể nâng cấp sau.

> **Đã chốt (2026-11-26):** Toàn bộ 6 màn hình trên đã được thiết kế & duyệt trong prototype artifact (xem link ở đầu file). Layout note detail dùng 2 cột trên desktop (cột đọc + rail), tự xếp 1 cột trên mobile. Bước triển khai code bám theo prototype này làm nguồn sự thật về UI.

---

## 6. Tính năng cốt lõi (Giai đoạn 1)

- Render MDX với code block có syntax highlight.
- Dark mode + responsive (chuẩn mobile, an toàn safe-area).
- Lọc/duyệt theo độ chín + topic.
- Backlinks giữa các note.
- Trang About kiêm landing cho HR: tóm tắt năng lực, link GitHub/CV, nút liên hệ.
- SEO: metadata + OpenGraph (share đẹp), `sitemap.xml`, RSS feed.

---

## 7. Kiểm thử & chất lượng (định nghĩa "xong")

- **Unit/content tests:** parse frontmatter đúng, schema validation chặn dữ liệu sai, dựng backlinks & topic đúng.
- **Component tests:** các component chính (note card, note page, theme toggle) render đúng.
- **Build:** `next build` chạy không lỗi; không dead link nội bộ.
- **Hiệu năng/chất lượng:** Lighthouse tốt (Performance/SEO/Accessibility) trước khi deploy.
- Mục tiêu coverage cho logic content-layer: ≥ 80%.

---

## 8. Tiêu chí thành công (Giai đoạn 1)

- Trang chủ giống mockup đã chốt, có dark mode.
- Thêm một note mới = tạo 1 file `.mdx`; site tự cập nhật list/topic/backlink.
- Site deploy công khai, có domain, luôn online để gửi HR/khách freelance.
- Có ≥ 3–5 note "evergreen" chất lượng làm chứng cứ năng lực lúc ra mắt.

---

## 9. Câu hỏi mở / quyết định sau

- Content layer cụ thể: **Velite** vs **Content Collections** (chốt ở bước kế hoạch triển khai).
- Domain name.
- Danh sách note khởi đầu (nội dung thật) — chuẩn bị song song.
