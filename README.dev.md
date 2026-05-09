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
├── release/        # APK releases cho production
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

## 📱 Mobile Development & Release

### Quy trình Dev → Test → Release

#### 1. **Local Development**

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

**Environment Variables (Local):**

```bash
# mobile/.env
EXPO_PUBLIC_API_URL=http://192.168.1.x:5000/api  # Thay x bằng IP máy bạn
```

#### 2. **Build APK Production**

Sau khi code xong và test kỹ trên Expo Go:

```bash
cd mobile

# Cập nhật API URL cho production
echo "EXPO_PUBLIC_API_URL=https://be-review-lecturers-huit.vercel.app/api" > .env

# Build APK release
npx expo run:android --variant release
```

**Yêu cầu:**

- Android Studio hoặc Android SDK đã cài đặt
- Java JDK 17+

**APK sẽ được tạo tại:**

```
mobile/android/app/build/outputs/apk/release/app-release.apk
```

#### 3. **Test APK Trên Thiết Bị**

```bash
# Cài APK lên thiết bị qua ADB
adb install mobile/android/app/build/outputs/apk/release/app-release.apk

# Hoặc copy file APK sang điện thoại và cài thủ công
```

**Checklist Test:**

- ✅ Đăng nhập/đăng ký
- ✅ Xem danh sách giảng viên
- ✅ Tạo review
- ✅ Vote review
- ✅ Bookmark
- ✅ So sánh giảng viên
- ✅ Kiểm tra kết nối API production

#### 4. **Release APK**

Sau khi test OK, release APK lên GitHub:

```bash
# 1. Bump version
cd mobile
npm version patch  # 1.0.0 → 1.0.1
# hoặc
npm version minor  # 1.0.0 → 1.1.0
# hoặc
npm version major  # 1.0.0 → 2.0.0

# 2. Copy APK vào thư mục release với tên chuẩn
VERSION=$(node -p "require('./package.json').version")
cp android/app/build/outputs/apk/release/app-release.apk \
   ../release/android/ReviewLecturers-Android-v${VERSION}.apk

# 3. Commit và push
cd ..
git add release/ mobile/package.json
git commit -m "release: mobile v${VERSION}"
git push origin main

# 4. Tạo GitHub Release
gh release create mobile-v${VERSION} \
  release/android/ReviewLecturers-Android-v${VERSION}.apk \
  --title "Mobile v${VERSION}" \
  --notes "## 📱 ReviewLecturers Mobile v${VERSION}

### 🚀 Tải xuống
- Android APK: Xem file đính kèm bên dưới

### 📝 Thay đổi
- [Liệt kê các thay đổi chính]

### 📥 Hướng dẫn cài đặt
1. Tải file APK về thiết bị Android
2. Bật 'Cài đặt từ nguồn không xác định' trong Settings
3. Mở file APK và cài đặt"
```

**Hoặc tạo Release thủ công trên GitHub:**

1. Vào repo → Releases → **New Release**
2. Tag: `mobile-v{version}` (ví dụ: `mobile-v1.0.0`)
3. Title: `Mobile v{version}`
4. Upload file APK từ `release/android/`
5. Viết release notes
6. **Publish release**

#### 5. **Cấu Trúc Thư Mục Release**

```
release/
└── android/
    ├── README.md
    ├── ReviewLecturers-Android-v1.0.0.apk
    ├── ReviewLecturers-Android-v1.0.1.apk
    └── ReviewLecturers-Android-v1.1.0.apk
```

**Lưu ý:**

- Chỉ commit APK vào Git nếu file < 50MB
- Nếu > 50MB, chỉ upload lên GitHub Releases (không commit vào Git)
- Luôn giữ ít nhất 2-3 version gần nhất trong `release/`

### Troubleshooting

**Build failed?**

```bash
# Clean build
cd mobile/android
./gradlew clean

# Rebuild
cd ..
npx expo run:android --variant release
```

**APK không cài được?**

- Bật "Install from unknown sources" trên Android
- Xóa app cũ trước khi cài mới
- Kiểm tra APK có bị corrupt không (file size > 0)

**Lỗi Android SDK?**

```bash
# Cài Android SDK qua Android Studio
# Hoặc dùng sdkmanager
sdkmanager "platforms;android-34" "build-tools;34.0.0"
```

**Lỗi Java version?**

```bash
# Kiểm tra Java version
java -version

# Cần Java 17+
# Download tại: https://adoptium.net/
```

---

## 🚀 Deployment

- **CI/CD:** Tự động chạy Unit Test qua GitHub Actions.
- **Backend:** Deploy trên Vercel (`be-review-lecturers-huit.vercel.app`)
- **Frontend:** Deploy trên Vercel (`reviewgiangvienhuit.vercel.app`)
- **Mobile:**
  - **Development**: Local build + Expo Go
  - **Production**: Manual build → Test → GitHub Releases

---

**HUIT Review Team** - _Build by students, for students._
