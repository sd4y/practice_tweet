# Y (Social Media App)

A full-stack social media application built with a **Turborepo** monorepo, **Next.js** (Frontend), **NestJS** (Backend), and **PostgreSQL** (Database).

## 🚀 Features

- **Authentication**: JWT-based auth with Login/Signup and automatic token management.
- **Feed**:
  - **For You**: Global stream of all tweets.
  - **Following**: Stream of tweets from followed users.
- **Posting**: Create text and image tweets (with image upload support).
- **Social Graph**: Follow/Unfollow users, Like/Unlike tweets.
- **Profile**: User profiles with bio, location, website, and tweet history.
- **Real-time Updates**: Optimistic UI updates for likes and posts.

## 🛠️ Tech Stack

- **Monorepo**: Turborepo
- **Frontend**: Next.js (App Router), React, Tailwind CSS, Axios
- **Backend**: NestJS, Prisma, PostgreSQL
- **Database**: PostgreSQL (via Supabase or local)

## 📂 Project Structure

- **`apps/web`**: Next.js Frontend application.
- **`apps/api`**: NestJS Backend API.
- **`packages/database`**: Prisma schema and client.

## 🚦 Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Database Setup

Ensure you have a PostgreSQL database running and a `.env` file in `packages/database` with `DATABASE_URL`.

```bash
# In packages/database
pnpm db:push
pnpm db:seed  # Optional: Seed initial data
```

### 3. Run Development Server

```bash
pnpm dev
# Starts API on http://localhost:3001
# Starts Web on http://localhost:3000
```

## 🗺️ Routing Guide

- `/`: **Landing Page** (Login/Signup entry).
- `/main`: **Main Feed** (Requires Auth).
- `/following`: **Following Feed** (Requires Auth).
- `/profile/[username]`: **User Profile**.

## 📝 Documentation
- [Architecture Guide](.md/guide/ARCHITECTURE.md)
- [Architecture Guide (KR)](.md/guide/ARCHITECTURE_KR.md)
- [UI Guide](.md/guide/UI_GUIDE.md)
- [Backend Checklist](CHECKLIST.md)
