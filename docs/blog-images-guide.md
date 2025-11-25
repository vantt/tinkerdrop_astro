# Blog Images Guide

Hướng dẫn chi tiết về cách quản lý và sử dụng hình ảnh trong blog posts.

## 📁 Cấu trúc thư mục

Blog sử dụng **colocation structure** - mỗi bài blog là một folder chứa cả nội dung và hình ảnh:

```
src/content/blog/
  ├── connecting-with-locals/
  │   ├── index.md          # Nội dung bài viết
  │   ├── hero.jpg          # Hình hero (bắt buộc nếu có heroImage)
  │   ├── market-scene.jpg  # Hình inline (tùy chọn)
  │   └── cooking.jpg       # Hình inline (tùy chọn)
  ├── eating-vietnam/
  │   ├── index.md
  │   ├── hero.jpg
  │   └── pho-bowl.jpg
```

### Ưu điểm của cấu trúc này:

✅ Tất cả assets của một bài ở cùng chỗ → dễ quản lý  
✅ Xóa/di chuyển bài → tự động mang theo hình  
✅ Astro tự động optimize hình (WebP, resize, lazy load)  
✅ Type-safe với Content Collections

## 🖼️ Cách thêm bài blog mới với hình ảnh

### Bước 1: Tạo folder cho bài blog

```bash
mkdir "src/content/blog/ten-bai-viet-moi"
```

### Bước 2: Tạo file `index.md`

```markdown
---
title: "Tiêu đề bài viết"
description: "Mô tả ngắn gọn"
pubDate: "2024-11-24"
heroImage: ./hero.jpg
tags: ["#travel", "#vietnam"]
---

Nội dung bài viết ở đây...
```

### Bước 3: Thêm hình ảnh

- **Hero image**: Đặt tên là `hero.jpg` trong cùng folder
- **Inline images**: Đặt tên mô tả rõ ràng (vd: `market-scene.jpg`, `food-stall.jpg`)

## 📝 Cách chèn hình vào giữa bài viết

### Cú pháp cơ bản

```markdown
![Mô tả hình ảnh](./ten-file-hinh.jpg)
```

### Ví dụ thực tế

```markdown
---
title: "Khám phá chợ đêm Kuala Lumpur"
heroImage: ./hero.jpg
---

Tôi đi dạo qua chợ đêm và thấy rất nhiều món ăn ngon...

![Khung cảnh chợ đêm sầm uất](./market-scene.jpg)

Sau đó tôi thử món satay nổi tiếng...

![Auntie đang nướng satay](./cooking-satay.jpg)

Món ăn thật tuyệt vời!
```

### Kết quả

- Hình sẽ tự động:
  - ✅ Responsive (co giãn theo màn hình)
  - ✅ Rounded corners + shadow
  - ✅ Hover effect (phóng to nhẹ)
  - ✅ Lazy load (tải khi scroll đến)
  - ✅ Optimize (WebP/AVIF format)

## 🎨 Styling tự động

Tất cả hình ảnh trong blog đã được style sẵn:

- **Rounded corners**: `border-radius: 0.5rem`
- **Shadow**: Subtle shadow để nổi bật
- **Hover effect**: Scale 1.02x khi hover
- **Spacing**: Margin top/bottom 2rem
- **Responsive**: Max-width 100%, height auto

## 📏 Kích thước hình ảnh khuyến nghị

### Hero Image

- **Tỷ lệ**: 16:9 (landscape)
- **Kích thước**: 1200x675px hoặc lớn hơn
- **Format**: JPG hoặc PNG
- **Dung lượng**: < 500KB (Astro sẽ tự optimize)

### Inline Images

- **Tỷ lệ**: Tùy ý (16:9, 4:3, 1:1 đều được)
- **Kích thước**: 800-1200px chiều rộng
- **Format**: JPG, PNG, hoặc WebP
- **Dung lượng**: < 300KB mỗi ảnh

## 🚀 Tối ưu hóa hình ảnh

### Trước khi upload

1. **Resize**: Dùng tool như [Squoosh](https://squoosh.app/) hoặc [TinyPNG](https://tinypng.com/)
2. **Compress**: Giảm dung lượng nhưng giữ chất lượng
3. **Format**: JPG cho ảnh thực, PNG cho ảnh có text/logo

### Astro tự động optimize

Astro sẽ tự động:

- Generate multiple sizes (400px, 768px, 1024px)
- Convert sang WebP/AVIF (browsers hiện đại)
- Lazy load images
- Add proper width/height attributes

## 🔍 Troubleshooting

### Hình không hiển thị?

1. **Kiểm tra path**: Đảm bảo dùng `./` cho relative path

   ```markdown
   ✅ Đúng: ![Alt](./image.jpg)
   ❌ Sai: ![Alt](image.jpg)
   ```

2. **Kiểm tra file tồn tại**: File phải ở cùng folder với `index.md`

3. **Kiểm tra extension**: `.jpg`, `.jpeg`, `.png`, `.webp` đều OK

### Build error?

Nếu gặp lỗi khi build:

```bash
npm run build
```

Kiểm tra:

- Tất cả images được reference phải tồn tại
- Không có typo trong filename
- File không bị corrupt

## 💡 Best Practices

### Đặt tên file

✅ **Tốt**: `market-night-scene.jpg`, `cooking-satay.jpg`  
❌ **Tránh**: `IMG_1234.jpg`, `photo.jpg`, `image1.jpg`

### Alt text

Luôn viết alt text mô tả rõ ràng:

```markdown
✅ Tốt: ![Auntie đang nướng satay trên bếp than](./cooking.jpg)
❌ Tránh: ![Image](./cooking.jpg)
```

### Tổ chức

- Mỗi bài blog = 1 folder
- Hero image luôn tên là `hero.jpg`
- Inline images đặt tên mô tả
- Không để quá nhiều hình (3-5 hình/bài là đủ)

## 📚 Ví dụ hoàn chỉnh

```markdown
---
title: "Ẩm thực đường phố Việt Nam"
description: "Khám phá những món ăn vặt tuyệt vời"
pubDate: "2024-11-24"
heroImage: ./hero.jpg
tags: ["#food", "#vietnam"]
---

Việt Nam nổi tiếng với ẩm thực đường phố phong phú...

![Xe bánh mì trên phố Sài Gòn](./banh-mi-cart.jpg)

Món bánh mì Việt Nam là sự kết hợp hoàn hảo...

![Tô phở nóng hổi](./pho-bowl.jpg)

Và không thể bỏ qua phở - linh hồn ẩm thực Việt!
```

## 🎯 Kết luận

Với colocation structure, việc quản lý hình ảnh trong blog trở nên đơn giản và hiệu quả. Astro lo phần optimize, bạn chỉ cần tập trung vào nội dung!

Có câu hỏi? Tham khảo [Astro Images Documentation](https://docs.astro.build/en/guides/images/).
