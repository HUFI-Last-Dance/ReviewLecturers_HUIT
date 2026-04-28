# 🎓 ReviewLecturers - Student-Led Faculty Insights

[![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20Express%20%7C%20Prisma%20%7C%20Expo-blue)](https://github.com/nicodolas/ReviewLecturers_HUIT)
[![Design Style](https://img.shields.io/badge/Design-Claymorphism-indigo)](d:/ReviewLecturers/design-system/reviewlecturers/MASTER.md)

**ReviewLecturers** là nền tảng giúp sinh viên chia sẻ và tham khảo các đánh giá về chất lượng giảng dạy theo từng **Giảng viên – Môn học – Học kỳ**. Dự án được xây dựng với mục tiêu minh bạch hóa thông tin và cải thiện trải nghiệm học tập.

---

## 🏗️ Kiến Trúc Hệ Thống (Monorepo)

```text
ReviewLecturers/
├── backend/    # Node.js Express API + Prisma ORM (Neon DB/PostgreSQL)
├── frontend/   # Next.js 15 (App Router) + Tailwind CSS v4
├── mobile/     # React Native (Expo) - iOS & Android Support
└── design-system/ # Master documentation for UI/UX
```

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, TanStack Query, Tailwind CSS v4, Lucide Icons.
- **Backend:** Express.js, TypeScript, Prisma, JWT Auth, Winston Logging.
- **Mobile:** Expo, React Native, Axios, SecureStore.
- **Database:** PostgreSQL (Neon Serverless).

---

## ⚙️ Hướng Dẫn Cài Đặt (Cho Developer)

Dự án sử dụng biến môi trường để quản lý cấu hình. Vui lòng **không commit** file `.env` thật lên repo.

### 1. Chuẩn bị biến môi trường
Tại mỗi thư mục (`backend`, `frontend`, `mobile`), bạn sẽ thấy file `.env.example`. Hãy copy và tạo file `.env` tương ứng:

```bash
# Tại thư mục gốc
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
cp mobile/.env.example mobile/.env
```

### 2. Cài đặt chi tiết từng phần

#### 🔹 Backend (Server API)
```bash
cd backend
npm install
npx prisma generate
npx prisma db push # Đồng bộ schema lên database của bạn
npm run dev        # Server chạy tại http://localhost:5000
```

#### 🔹 Frontend (Web Client)
```bash
cd frontend
npm install
npm run dev        # App chạy tại http://localhost:3000
```

#### 🔹 Mobile (Expo App)
```bash
cd mobile
npm install
npx expo start     # Quét mã QR bằng ứng dụng Expo Go trên điện thoại
```

---

## 🎨 Design System: Claymorphism

Dự án này sử dụng phong cách **Claymorphism** (Bubbly/Soft UI). 
- **Quy tắc thiết kế:** Mọi component phải tuân thủ bo góc `24px` và hiệu ứng đổ bóng kép (Shadow).
- **Xem chi tiết:** [Design Master Guide](./design-system/reviewlecturers/MASTER.md).

---

## 🔐 Bảo Mật & Quy Tắc Contribution

1. **Environment Variables:** Luôn cập nhật file `.env.example` nếu bạn thêm biến môi trường mới.
2. **Commit Message:** Sử dụng tiếng Anh hoặc tiếng Việt có dấu, mô tả rõ thay đổi (VD: `feat: add bookmark feature`, `fix: lecturer list loading`).
3. **Branching:** Tạo nhánh mới từ `main` để phát triển tính năng (VD: `feature/clay-ui`).
4. **Security Check:** Tuyệt đối không để lộ mật khẩu database hay JWT Secret trong code.

---

## 🚀 Deployment

- **Backend:** Phù hợp deploy lên Render, Heroku hoặc Vercel (Serverless Functions).
- **Frontend:** Tối ưu nhất cho Vercel.
- **Mobile:** Build APK/IPA thông qua EAS (Expo Application Services).

---

## 📞 Liên Hệ & Hỗ Trợ

Nếu bạn gặp lỗi trong quá trình cài đặt, hãy tạo một **Issue** hoặc liên hệ với Admin dự án.

**HUIT Review Team** - *Build by students, for students.*
