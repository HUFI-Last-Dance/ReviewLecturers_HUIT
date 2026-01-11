# 🎓 ReviewLecturers - Platform nhận xét giảng viên

> Nền tảng web cho sinh viên đăng nhận xét về hoạt động giảng dạy theo từng **Giảng viên – Môn học – Học kỳ**, với hệ thống upvote/downvote và thảo luận công khai.

---

## 📁 CẤU TRÚC DỰ ÁN

```
ReviewLecturers/
├── backend/              # Express + TypeScript + Prisma
│   ├── src/
│   │   ├── controllers/ # Logic xử lý
│   │   ├── routes/      # Định nghĩa API
│   │   ├── middleware/  # Auth & Validation
│   │   └── utils/       # Helper functions
│   ├── prisma/          # Schema & Seeds
│   └── .env             # Environment variables
│
└── frontend/            # Next.js 15 + TypeScript + Tailwind
    ├── app/             # App Router
    ├── components/      # Reusable UI components
    └── services/        # API integration
```

---

## 🚀 TÍNH NĂNG ĐÃ HOÀN THÀNH

### Backend
- ✅ **Authentication:** Đăng ký, Đăng nhập (JWT), Lấy thông tin user.
- ✅ **Lecturer Management:** Tìm kiếm (hỗ trợ tiếng Việt không dấu), Lọc theo học vị, Phân trang.
- ✅ **Review System:** Upvote/Downvote giảng viên & review.
- ✅ **Profile:** Trang cá nhân, Cập nhật thông tin (có cooldown 3 ngày).
- ✅ **Admin Tools:** Bulk Import (Giảng viên, Môn học, Học kỳ, Phân công) từ JSON.

### Frontend
- ✅ **UI/UX:** Giao diện Responsive, Dark Mode support.
- ✅ **Features:** Tìm kiếm giảng viên Live search, Filter, Xem chi tiết review.

---

## ⚙️ CÀI ĐẶT & CHẠY DỰ ÁN

### 1. Backend

Cần tạo file `backend/.env` (tham khảo mẫu hoặc hỏi admin dự án):
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
PORT=5000
```

Chạy lệnh:
```bash
cd backend
npm install
npx prisma generate
npx prisma db push  # Cập nhật schema lên DB
npm run seed        # (Tùy chọn) Tạo dữ liệu mẫu
npm run dev         # Server chạy tại http://localhost:5000
```

### 2. Frontend

Cần tạo file `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

Chạy lệnh:
```bash
cd frontend
npm install
npm run dev         # App chạy tại http://localhost:3000
```

---

## 📝 DEPLOYMENT

### Backend (Render/Heroku/Vercel)
- Set Environment Variables trên server tương ứng.
- Build command: `npm run build`
- Start command: `npm start`

### Frontend (Vercel/Netlify)
- Import repo.
- Set `NEXT_PUBLIC_API_URL` trỏ về domain backend đã deploy (VD: `https://api.myapp.com/api`).
- Preset: Next.js.

---

## 📞 SUPPORT

- **HUIT Review Team**

