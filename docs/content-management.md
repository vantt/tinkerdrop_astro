# Hướng dẫn Quản lý Nội dung (Content Management)

Tài liệu này hướng dẫn cách đăng bài viết mới và quản lý hình ảnh trên TinkerDrop, hỗ trợ cả hai phương pháp: sử dụng **Keystatic CMS** và **Local Markdown Editor** (VS Code, Obsidian, v.v.).

## 1. Quy tắc Quản lý Hình ảnh (Quan trọng)

Để đảm bảo tính nhất quán và tránh lỗi hiển thị, tất cả hình ảnh bài viết phải tuân thủ quy tắc sau:

- **Vị trí lưu trữ:** Tất cả hình ảnh phải được lưu trong thư mục `public/blog-images/{slug-bai-viet}/`.
  - `{slug-bai-viet}` là tên thư mục (slug) của bài viết tương ứng.
  - Ví dụ: Nếu bài viết có slug là `bai-viet-dau-tien`, hình ảnh sẽ nằm trong `public/blog-images/bai-viet-dau-tien/`.
- **Định dạng đường dẫn trong Markdown:** Sử dụng đường dẫn tuyệt đối bắt đầu từ gốc (root).
  - **Đúng:** `/blog-images/bai-viet-dau-tien/hinh-anh.jpg`
  - **Sai:** `./hinh-anh.jpg`, `../../public/blog-images/...`

---

## 2. Đăng bài bằng Keystatic (Khuyên dùng)

Keystatic cung cấp giao diện trực quan, tự động xử lý việc tạo file và lưu ảnh đúng quy tắc.

1.  **Truy cập Admin UI:**
    - Mở trình duyệt và vào địa chỉ: `http://localhost:4321/keystatic` (khi chạy local) hoặc đường dẫn production tương ứng.
2.  **Tạo bài viết mới:**
    - Chọn collection **Blog**.
    - Nhấn nút **Create**.
3.  **Nhập nội dung:**
    - **Title:** Nhập tiêu đề bài viết (Slug sẽ được tự động tạo từ tiêu đề).
    - **Hero Image:** Upload ảnh đại diện. Keystatic sẽ tự động lưu vào `public/blog-images/{slug}/`.
    - **Content:** Soạn thảo nội dung. Bạn có thể chèn ảnh trực tiếp trong trình soạn thảo, ảnh cũng sẽ được lưu đúng chỗ.
    - Điền các thông tin khác: Description, PubDate, Category, Tags, Published.
4.  **Lưu bài viết:** Nhấn **Create** (hoặc **Save**).

---

## 3. Đăng bài bằng Local Markdown Editor (Thủ công)

Dành cho những ai thích viết trực tiếp bằng code editor hoặc các công cụ Markdown chuyên dụng.

1.  **Tạo thư mục bài viết:**
    - Tạo thư mục mới trong `src/content/blog/` với tên là slug của bài viết.
    - Ví dụ: `src/content/blog/bai-viet-moi/`
2.  **Tạo file nội dung:**
    - Trong thư mục vừa tạo, tạo file `index.md`.
3.  **Cấu trúc Frontmatter:**
    Copy và chỉnh sửa mẫu sau vào đầu file `index.md`:

    ```markdown
    ---
    title: "Tiêu đề bài viết"
    description: "Mô tả ngắn gọn về bài viết."
    pubDate: 2023-10-27
    updatedDate: 2023-10-28
    heroImage: /blog-images/bai-viet-moi/anh-dai-dien.jpg
    category: "Học" # Chọn một: Học, Làm, Chơi, Khác
    tags: ["tag1", "tag2"]
    published: true
    ---
    ```

4.  **Quản lý hình ảnh thủ công:**
    - Tạo thư mục `public/blog-images/bai-viet-moi/`.
    - Copy tất cả hình ảnh muốn dùng vào thư mục đó.
    - Trong file markdown, dẫn link ảnh theo dạng: `/blog-images/bai-viet-moi/ten-anh.jpg`.

---

## 4. Lưu ý khi Deploy

- Dự án sử dụng chế độ **Hybrid Rendering** (SSR cho Keystatic, Static cho nội dung).
- Khi deploy lên Vercel hoặc Netlify, đảm bảo biến môi trường và adapter được cấu hình chính xác (đã được thiết lập sẵn trong `astro.config.mjs`).
