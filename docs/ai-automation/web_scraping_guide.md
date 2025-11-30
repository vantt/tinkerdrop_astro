# Hướng dẫn Extract Nội dung Website ra Markdown với Antigravity

Để extract nội dung website một cách chuyên sâu và linh hoạt cho nhiều website khác nhau, chúng ta có 3 cấp độ tiếp cận. Với nhu cầu của bạn ("chuyên sâu", "nhiều website"), **Cấp độ 3** là phương án tối ưu nhất.

## 1. Cấp độ Cơ bản: Dùng lệnh trực tiếp (One-off)

Dành cho việc lấy nội dung nhanh của một trang đơn lẻ.

- **Cách dùng:** Chat với Antigravity _"Đọc nội dung URL này và chuyển sang markdown cho tôi"_.
- **Công cụ bên dưới:** Antigravity sẽ dùng tool `read_url_content`.
- **Ưu điểm:** Nhanh, không cần setup.
- **Nhược điểm:** Không xử lý được hàng loạt, khó tùy chỉnh việc lọc rác (quảng cáo, menu thừa), không tự động tải ảnh.

## 2. Cấp độ Nâng cao: Dùng Browser Agent

Dành cho các trang web động (SPA), cần đăng nhập, hoặc tương tác phức tạp mà `fetch` thông thường không lấy được.

- **Cách dùng:** Chat _"Mở trình duyệt vào URL này, chờ load xong, click vào nút 'Xem thêm', sau đó copy nội dung bài viết"_.
- **Công cụ bên dưới:** Antigravity dùng `browser_subagent`.
- **Ưu điểm:** Xử lý được mọi loại web phức tạp, web chặn bot.
- **Nhược điểm:** Chậm, khó tự động hóa hàng loạt lớn.

## 3. Cấp độ Chuyên sâu (Khuyên dùng): Custom Script (Node.js)

Đây là cách tiếp cận tương tự file `scripts/scrape-tinkerdrop.js` hiện có.

- **Công cụ:** Node.js + Cheerio (parse HTML) + Turndown (convert HTML to Markdown) + Fetch.
- **Ưu điểm vượt trội:**
  - **Kiểm soát tuyệt đối:** Bạn quyết định chính xác lấy thẻ HTML nào, bỏ thẻ nào (quảng cáo, related posts).
  - **Batch Processing:** Quét toàn bộ website hoặc một danh sách URL.
  - **Xử lý Media:** Tự động tải ảnh về folder local và sửa đường dẫn trong file Markdown (quan trọng để lưu trữ lâu dài).
  - **Metadata:** Tự động trích xuất và format frontmatter (title, date, tags, category) theo đúng chuẩn project Astro của bạn.

### Quy trình (Workflow) để Antigravity giúp bạn:

Bạn không cần tự viết code, hãy dùng Antigravity như một "Script Generator":

1.  **Bước 1: Cung cấp Mẫu**

    - Gửi cho Antigravity 1 URL bài viết mẫu của website cần lấy.
    - _(Tùy chọn)_ Gửi thêm URL trang danh sách (category/index) nếu muốn lấy hàng loạt.

2.  **Bước 2: Yêu cầu Phân tích & Code**

# Hướng dẫn Extract Nội dung Website ra Markdown với Antigravity

Để extract nội dung website một cách chuyên sâu và linh hoạt cho nhiều website khác nhau, chúng ta có 3 cấp độ tiếp cận. Với nhu cầu của bạn ("chuyên sâu", "nhiều website"), **Cấp độ 3** là phương án tối ưu nhất.

## 1. Cấp độ Cơ bản: Dùng lệnh trực tiếp (One-off)

Dành cho việc lấy nội dung nhanh của một trang đơn lẻ.

- **Cách dùng:** Chat với Antigravity _"Đọc nội dung URL này và chuyển sang markdown cho tôi"_.
- **Công cụ bên dưới:** Antigravity sẽ dùng tool `read_url_content`.
- **Ưu điểm:** Nhanh, không cần setup.
- **Nhược điểm:** Không xử lý được hàng loạt, khó tùy chỉnh việc lọc rác (quảng cáo, menu thừa), không tự động tải ảnh.

## 2. Cấp độ Nâng cao: Dùng Browser Agent

Dành cho các trang web động (SPA), cần đăng nhập, hoặc tương tác phức tạp mà `fetch` thông thường không lấy được.

- **Cách dùng:** Chat _"Mở trình duyệt vào URL này, chờ load xong, click vào nút 'Xem thêm', sau đó copy nội dung bài viết"_.
- **Công cụ bên dưới:** Antigravity dùng `browser_subagent`.
- **Ưu điểm:** Xử lý được mọi loại web phức tạp, web chặn bot.
- **Nhược điểm:** Chậm, khó tự động hóa hàng loạt lớn.

## 3. Cấp độ Chuyên sâu (Khuyên dùng): Custom Script (Node.js)

Đây là cách tiếp cận tương tự file `scripts/scrape-tinkerdrop.js` hiện có.

- **Công cụ:** Node.js + Cheerio (parse HTML) + Turndown (convert HTML to Markdown) + Fetch.
- **Ưu điểm vượt trội:**
  - **Kiểm soát tuyệt đối:** Bạn quyết định chính xác lấy thẻ HTML nào, bỏ thẻ nào (quảng cáo, related posts).
  - **Batch Processing:** Quét toàn bộ website hoặc một danh sách URL.
  - **Xử lý Media:** Tự động tải ảnh về folder local và sửa đường dẫn trong file Markdown (quan trọng để lưu trữ lâu dài).
  - **Metadata:** Tự động trích xuất và format frontmatter (title, date, tags, category) theo đúng chuẩn project Astro của bạn.

### Quy trình (Workflow) để Antigravity giúp bạn:

Bạn không cần tự viết code, hãy dùng Antigravity như một "Script Generator":

1.  **Bước 1: Cung cấp Mẫu**

    - Gửi cho Antigravity 1 URL bài viết mẫu của website cần lấy.
    - _(Tùy chọn)_ Gửi thêm URL trang danh sách (category/index) nếu muốn lấy hàng loạt.

2.  **Bước 2: Yêu cầu Phân tích & Code**

    - Prompt: _"Tôi muốn scrape trang `example.com`. Hãy phân tích và viết script Node.js để extract bài viết. Cấu trúc cần lấy: Tiêu đề, Nội dung, Ngày đăng, Ảnh đại diện. Output ra file Markdown có frontmatter giống project này. Lưu ảnh vào folder tương ứng."_

3.  **Bước 3: Chạy và Tinh chỉnh**
    - Antigravity sẽ viết file script (ví dụ: `scripts/scrape-example.js`).
    - Bạn chạy thử: `node scripts/scrape-example.js <url>`.
    * Nếu kết quả chưa đẹp (vỡ bảng, dính rác), báo lại Antigravity: _"Script đang bị dính phần 'Bài viết liên quan' ở cuối, hãy sửa selector để loại bỏ nó"_.

## 4. Cấp độ Hiện đại: Firecrawl / AI Scrapers (MCP)

Đây là thế hệ công cụ mới, được thiết kế chuyên biệt để biến website thành dữ liệu cho LLM (Markdown sạch).

- **Công cụ:** Firecrawl (có thể chạy qua API hoặc MCP), Jina Reader.
- **Cơ chế:** Bạn đưa URL -> Nó trả về Markdown đã được làm sạch, loại bỏ header/footer/nav tự động.
- **Ưu điểm:**
  - **"Universal":** Không cần soi code HTML để tìm CSS selector. Nó tự đoán nội dung chính.
  - **Xử lý Dynamic Content:** Firecrawl xử lý tốt các trang web dùng nhiều JavaScript (React, Vue) mà `cheerio` bó tay.
  - **Crawl Deep:** Có chế độ tự động crawl các link con (sub-pages).
- **Nhược điểm:**
  - **Chi phí:** Thường là dịch vụ trả phí hoặc giới hạn số trang (nếu dùng bản cloud). Bản self-host cần setup Docker phức tạp.
  - **Thiếu tùy biến Project:** Nó trả về Markdown chuẩn, nhưng **không** tự động tải ảnh về folder local của bạn, không tự điền Frontmatter theo cấu trúc riêng của Astro (ví dụ: `heroImage: ./image.png`).
- **Kết luận:** Firecrawl rất tuyệt để lấy nội dung thô nhanh chóng từ các trang lạ. Tuy nhiên, để đưa vào source code Astro, bạn vẫn cần một script nhỏ để "hứng" dữ liệu từ Firecrawl và lưu file/ảnh đúng chỗ.

### Mẹo cho "Số website có thể thay đổi"

Nếu bạn cần scrape nhiều site khác nhau, chúng ta có thể tổ chức theo 2 hướng:

1.  **Nhiều Script (Cheerio):** Mỗi website một file script riêng. Tốt nhất cho các site cố định, cần lấy định kỳ.
2.  **Hybrid (Firecrawl + Script):** Dùng Firecrawl để lấy nội dung thô (Markdown), sau đó dùng một script chung để download ảnh trong Markdown đó về máy và thêm Frontmatter. Cách này cân bằng tốt nhất giữa tốc độ và chất lượng.
