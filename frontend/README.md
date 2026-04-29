# 🎨 Frontend - ReviewLecturers

Next.js 15 application built with TypeScript, Tailwind CSS, and React Query.

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn UI
- **State Management:** React Query (TanStack Query) + Context API
- **Icons:** Lucide React

## ⚙️ Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:5000/api"
   ```

3. **Run Application:**
   ```bash
   npm run dev
   ```

## 📁 Key Features

- **Authentication:** Login/Register/Profile Management.
- **Lecturers:** Search, Filter by Degree, View Details.
- **Reviews:** Post reviews, Discussion threads, Vote system.
- **Responsive Design:** Mobile-first approach.
- **Dark Mode:** System-preference aware & manual toggle.

## 📦 Project Structure

- `app/`: Next.js App Router pages
- `components/`: Reusable UI components
- `services/`: API integration services
- `contexts/`: React Contexts (Auth, Theme, etc.)
- `hooks/`: Custom React hooks
