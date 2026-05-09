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

_Lệnh này sẽ tự động cài đặt thư viện cho cả Backend, Frontend, Mobile và thiết lập hệ thống bảo vệ Husky._

### 2. Cấu hình biến môi trường

Copy file `.env.example` thành `.env` ở các thư mục tương ứng:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
cp mobile/.env.example mobile/.env
```

### 3. Chạy dự án

Bạn không cần `cd` vào từng thư mục, chỉ cần dùng các lệnh từ thư mục gốc:

| Thành phần   | Lệnh chạy Dev          | Lệnh Build/Check         |
| :----------- | :--------------------- | :----------------------- |
| **Backend**  | `npm run dev:backend`  | `npm run build:backend`  |
| **Frontend** | `npm run dev:frontend` | `npm run build:frontend` |
| **Mobile**   | `npm run dev:mobile`   | `npm run build:mobile`   |
| **Tất cả**   | -                      | `npm run build:all`      |

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

## 📱 Mobile Development Workflow

### Quy trình Dev → Test → Deploy

#### 1. **Local Development (Feature Branch)**

Phát triển tính năng trên branch `feat/ten-tinh-nang`:

```bash
# Chạy Expo dev server
cd mobile
npm start

# Hoặc từ thư mục gốc
npm run dev:mobile
```

**Test trên thiết bị:**

- Quét QR code bằng Expo Go app (Android/iOS)
- Hoặc chạy trực tiếp: `npm run android` / `npm run ios`

#### 2. **Dev Branch - Testing Build**

Sau khi code xong, tạo Pull Request lên `dev`:

```bash
git checkout -b feat/ten-tinh-nang
# ... code xong ...
git add .
git commit -m "feat: mô tả tính năng"
git push origin feat/ten-tinh-nang
```

**Tạo PR lên `dev`** → Sau khi merge:

- ✅ CI tự động build APK
- 📦 APK được lưu trong GitHub Actions Artifacts (30 ngày)
- 💬 Comment tự động với link download

**Download APK để test:**

1. Vào [GitHub Actions](https://github.com/nicodolas/ReviewLecturers_HUIT/actions)
2. Chọn workflow run "Mobile Dev Build"
3. Download APK từ "Artifacts" section
4. Cài đặt trên thiết bị Android để test

#### 3. **Main Branch - Production Release**

Sau khi test OK trên `dev`, tạo PR lên `main`:

```bash
# Từ dev branch
git checkout dev
git pull origin dev
# Tạo PR lên main
```

**Sau khi merge vào `main`:**

- 🚀 CI tự động build APK production
- 📦 Tạo GitHub Release với tag `mobile-vX.X.X`
- 🔗 APK được publish công khai
- 📥 Người dùng có thể tải từ [Releases page](https://github.com/nicodolas/ReviewLecturers_HUIT/releases)

**Manual Release (nếu cần):**

```bash
# Trigger manual build với version cụ thể
# Vào GitHub Actions → Mobile Production Release → Run workflow
# Nhập version: 1.0.0
```

### Cấu trúc File APK

**Dev Build:**

```
ReviewLecturers-Dev-v1.0.0-{commit-sha}.apk
```

- Lưu trong GitHub Actions Artifacts
- Retention: 30 ngày
- Dùng để test nội bộ

**Production Build:**

```
ReviewLecturers-Android-v1.0.0.apk
```

- Lưu trong GitHub Releases
- Public, permanent
- Dùng cho end-users

### Environment Variables

**Dev Build** (`.env` trong mobile/):

```bash
EXPO_PUBLIC_API_URL=http://localhost:3000/api  # Local dev
# hoặc
EXPO_PUBLIC_API_URL=https://dev-api.reviewlecturers.com/api  # Dev server
```

**Production Build:**

```bash
EXPO_PUBLIC_API_URL=https://api.reviewlecturers.com/api
```

> [!NOTE]
> Cấu hình secrets trong GitHub Settings → Secrets and variables → Actions:
>
> - `DEV_API_URL`: API URL cho dev builds
> - `PROD_API_URL`: API URL cho production builds

### Bump Version

Trước khi release production, cập nhật version trong `mobile/package.json`:

```bash
cd mobile
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
```

### Troubleshooting

**Build failed?**

1. Kiểm tra logs trong GitHub Actions
2. Test build local: `cd mobile && npx expo prebuild --platform android`
3. Kiểm tra `mobile/android/` folder

**APK không cài được?**

1. Bật "Install from unknown sources" trên Android
2. Kiểm tra APK signature
3. Xóa app cũ trước khi cài mới

---

## 🚀 Deployment

- **CI/CD:** Tự động chạy Unit Test qua GitHub Actions.
- **Backend:** Đã tối ưu cho Vercel/Heroku.
- **Frontend:** Deploy mượt mà nhất trên Vercel.
- **Mobile:**
  - **Dev**: Auto-build APK khi merge vào `dev` → Download từ Actions Artifacts
  - **Production**: Auto-release khi merge vào `main` → Download từ GitHub Releases

---

**HUIT Review Team** - _Build by students, for students._
