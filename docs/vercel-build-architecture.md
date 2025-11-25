# Kiến trúc Build và Vận hành của Astro trên Vercel

Tài liệu này mô tả chi tiết cách ứng dụng Astro (`tinker-drop`) được build và deploy lên nền tảng Vercel, cũng như cấu trúc file được tạo ra trong quá trình này.

## 1. Tổng quan

Dự án sử dụng **@astrojs/vercel** adapter. Adapter này cho phép Astro build ra định dạng tương thích với **Vercel Build Output API (v3)**.

Thay vì build ra một thư mục `dist/` thông thường như các static site generator khác, adapter này sẽ tạo ra thư mục `.vercel/output`. Vercel sẽ tự động nhận diện thư mục này và deploy mà không cần cấu hình thêm phức tạp.

## 2. Quy trình Build (How Build Works)

Khi lệnh `npm run build` được thực thi, các bước sau sẽ diễn ra:

1.  **Astro Build**:

    - Astro biên dịch code (`.astro`, `.md`, `.js`, `.ts`).
    - Xử lý các assets (CSS, images).
    - Dựa vào cấu hình `adapter: vercel()`, Astro sẽ output kết quả vào thư mục `.vercel/output`.

2.  **Pagefind Indexing** (Custom Step):
    - Sau khi Astro build xong, lệnh `pagefind --site .vercel/output/static` được chạy.
    - Pagefind sẽ quét toàn bộ các file HTML tĩnh trong `.vercel/output/static` để tạo chỉ mục tìm kiếm.
    - Các file index của Pagefind sẽ được ghi đè/thêm vào `.vercel/output/static/pagefind`.

## 3. Cấu trúc File Output (Which files are produced)

Kết quả cuối cùng nằm trong thư mục `.vercel/output`. Cấu trúc quan trọng bao gồm:

### `.vercel/output/static/`

Đây là nơi chứa tất cả các tài nguyên tĩnh (Static Assets).

- **HTML Files**: Các trang được pre-render (SSG). Ví dụ: `index.html`, `about/index.html`.
- **CSS & JS**: Các file style và script đã được bundle và hash tên.
- **Images**: Ảnh trong `public/` hoặc ảnh đã được tối ưu hóa.
- **\_pagefind/**: Thư mục chứa index tìm kiếm được tạo bởi lệnh `pagefind`.

### `.vercel/output/functions/` (Nếu sử dụng SSR)

Nếu dự án có sử dụng Server-Side Rendering (SSR) hoặc API Routes động:

- Chứa các Serverless Functions để xử lý request động.
- Mỗi entry point sẽ được map với một function.

### `.vercel/output/config.json`

File cấu hình định tuyến cho Vercel.

- Nó bảo Vercel biết request nào trỏ đến file tĩnh nào, và request nào cần gọi Serverless Function.
- Chứa thông tin về redirects, headers, và routes.

## 4. Vận hành trên Vercel (Where they are stored)

Khi deploy lên Vercel:

1.  **Detection**: Vercel phát hiện framework là Astro.
2.  **Build Command**: Vercel chạy lệnh `npm run build`.
    - _Lưu ý quan trọng_: Cần đảm bảo Setting "Build Command" trên Vercel Dashboard là `npm run build` (hoặc để mặc định nếu `package.json` đã cấu hình đúng) để đảm bảo bước `pagefind` được chạy.
3.  **Output Pickup**: Vercel tự động tìm thấy thư mục `.vercel/output`.
    - Nội dung trong `static/` được đẩy lên **Vercel Edge Network (CDN)** để phục vụ cực nhanh.
    - Nội dung trong `functions/` được deploy thành **Vercel Serverless Functions**.

## 5. Lưu ý cho Developer

- **Kiểm tra Build Local**: Bạn có thể chạy `npm run build` ở local để thấy thư mục `.vercel` được tạo ra.
- **Pagefind**: Nếu search không hoạt động, hãy kiểm tra xem thư mục `.vercel/output/static/pagefind` có tồn tại sau khi build không.
- **Adapter Config**: Mọi cấu hình liên quan đến Vercel (như Analytics, Image Service) nên được chỉnh trong `astro.config.mjs` phần `adapter: vercel({...})`.
