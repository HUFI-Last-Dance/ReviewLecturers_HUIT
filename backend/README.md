# 🛠️ Backend - ReviewLecturers

Express.js REST API with TypeScript, PostgreSQL (Neon), and Prisma ORM.

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JWT

## ⚙️ Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
   JWT_SECRET="your_secret_key"
   PORT=5000
   ```

3. **Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run seed
   ```

4. **Run Server:**
   ```bash
   npm run dev
   ```

## 📝 API Endpoints

- **Auth:**
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
  - `PUT /api/auth/profile` (Update profile with 3-day cooldown)

- **Lecturers:**
  - `GET /api/lecturers` (Search & Filter)
  - `GET /api/lecturers/:id`
  - `POST /api/academic/votes/:lecturerId`

- **Reviews:**
  - `GET /api/reviews/my-reviews`
  - `POST /api/reviews`
  - `DELETE /api/reviews/:id`
  - `POST /api/reviews/:reviewId/vote`

- **Import (Admin):**
  - `POST /api/bulk/lecturers`
  - `POST /api/bulk/subjects`
  - `POST /api/bulk/terms`
  - `POST /api/bulk/assignments`
