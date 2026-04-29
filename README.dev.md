# 🎓 ReviewLecturers - Student-Led Faculty Insights

[![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20Express%20%7C%20Prisma%20%7C%20Expo-blue)](https://github.com/nicodolas/ReviewLecturers_HUIT)
[![Design Style](https://img.shields.io/badge/Design-Claymorphism-indigo)](./design-system/reviewlecturers/MASTER.md)
[![CI/CD Status](https://github.com/nicodolas/ReviewLecturers_HUIT/actions/workflows/ci.yml/badge.svg)](https://github.com/nicodolas/ReviewLecturers_HUIT/actions)

**ReviewLecturers** là nền tảng giúp sinh viên chia sẻ và tham khảo các đánh giá về chất lượng giảng dạy theo từng **Giảng viên – Môn học – Học kỳ**. Dự án được xây dựng với mục tiêu minh bạch hóa thông tin và cải thiện trải nghiệm học tập.

---

## 🏗️ Kiến Trúc Hệ Thống (Monorepo)

Dự án được quản lý theo mô hình **npm workspaces**, giúp quản lý Backend, Frontend và Mobile trong cùng một kho chứa duy nhất.

```text
ReviewLecturers/
├── backend/        # Node.js Express API + Prisma ORM
├── frontend/       # Next.js 15 (App Router)
├── mobile/         # React Native (Expo)
├── design-system/  # Quy chuẩn thiết kế (Claymorphism)
└── package.json    # "Tổng tư lệnh" quản lý toàn bộ dự án
```

---

## ⚙️ Hướng Dẫn Cài Đặt Nhanh

Nếu bạn là Developer mới, hãy thực hiện theo các bước sau để bắt đầu:

### 1. Cài đặt toàn bộ (Chỉ 1 lệnh)
Đứng tại thư mục gốc và chạy:
```bash
npm install
```
*Lệnh này sẽ tự động cài đặt thư viện cho cả Backend, Frontend, Mobile và thiết lập hệ thống bảo vệ Husky.*

### 2. Cấu hình biến môi trường
Copy file `.env.example` thành `.env` ở các thư mục tương ứng:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
cp mobile/.env.example mobile/.env
```

### 3. Chạy dự án
Bạn không cần `cd` vào từng thư mục, chỉ cần dùng các lệnh từ thư mục gốc:

| Thành phần | Lệnh chạy Dev | Lệnh Build/Check |
| :--- | :--- | :--- |
| **Backend** | `npm run dev:backend` | `npm run build:backend` |
| **Frontend** | `npm run dev:frontend` | `npm run build:frontend` |
| **Mobile** | `npm run dev:mobile` | `npm run build:mobile` |
| **Tất cả** | - | `npm run build:all` |

---

## 🔐 Quy Trình Đẩy Code (Git Workflow)

Dự án có hệ thống **Husky** bảo vệ. Trước khi `commit`, hệ thống sẽ tự động kiểm tra lỗi TypeScript và Unit Test.

1.  **Code xong:** `git add .`
2.  **Commit:** `git commit -m "mô tả thay đổi"` (Husky sẽ quét lỗi tại đây).
3.  **Push:** `git push origin main`.

> [!TIP]
> Nếu Husky báo lỗi (Chữ đỏ), bạn phải sửa hết lỗi đó mới có thể Commit. Điều này giúp đảm bảo Repo luôn sạch và không bị lỗi Build trên Vercel/GitHub.

---

## 🎨 Design System: Claymorphism

Dự án này sử dụng phong cách **Claymorphism** (Bubbly/Soft UI). 
- **Quy tắc thiết kế:** Mọi component phải tuân thủ bo góc `24px` và hiệu ứng đổ bóng kép (Shadow).
- **Xem chi tiết:** [Design Master Guide](./design-system/reviewlecturers/MASTER.md).

---

## 🚀 Deployment

- **CI/CD:** Tự động chạy Unit Test qua GitHub Actions.
- **Backend:** Đã tối ưu cho Vercel/Heroku.
- **Frontend:** Deploy mượt mà nhất trên Vercel.
- **Mobile:** Build qua Expo EAS.

---

**HUIT Review Team** - *Build by students, for students.*
