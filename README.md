a# Promptify AI – AI SaaS Platform

Promptify AI is a production-ready Software as a Service (SaaS) platform built with the PERN stack (PostgreSQL, Express, React, Node). It provides a suite of AI-driven tools including a chat assistant, resume analyzer, college admission bot, and more.

## 🚀 Features

- **Authentication System**: Secure JWT-based login, signup, and logout with bcrypt password hashing.
- **Smart AI Chat**: Real-time streaming responses using OpenAI's GPT models.
- **Resume Analyzer**: PDF upload capability with AI-powered scoring and feedback.
- **SaaS Business Logic**: Token-based usage system with Stripe subscription integration.
- **Protected Dashboard**: Personalized user area with token meter and history logs.
- **Premium UI**: Modern dark theme with glassmorphism, Framer Motion animations, and responsive design.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion, TanStack Query (React Query).
- **Backend**: Node.js, Express.js.
- **ORM**: Prisma (connected to PostgreSQL).
- **AI**: OpenAI API.
- **Payments**: Stripe Checkout & Webhooks.

---

## 📦 Folder Structure

```text
/promptify-ai
  /client          # Frontend React Application
    /src
      /api         # Axios instance & API calls
      /components  # Reusable UI components
      /pages       # Tool pages (Chat, Resume, etc.)
  /server          # Backend Express Application
    /prisma        # Database Schema
    /src
      /controllers # Route logic
      /routes      # API endpoints
      /services    # External service integrations (OpenAI, etc.)
```

---

## 🛠️ Setup Instructions

### 1. Database Setup
The project is currently configured to use **SQLite** for zero-configuration local development. The database file (`dev.db`) is automatically created in the `/server/prisma` folder.

### 2. Backend Setup
1. Navigate to `/server`.
2. Install dependencies: `npm install`.
3. Create a `.env` file from the following template:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="any-secure-string"
   OPENAI_API_KEY="sk-..."
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   PORT=5000
   FRONTEND_URL="http://localhost:5173"
   ```
4. Run Prisma migrations: `npx prisma migrate dev --name init`.

### 3. Frontend Setup
1. Navigate to `/client`.
2. Install dependencies: `npm install`.
3. Start development server: `npm run dev`.

---

## 🚀 Deployment Guide

### Database (Supabase)
- Create a project on [Supabase](https://supabase.com).
- Copy the Connection string (URI) to your backend `.env`.

### Backend (Render)
- Connect your GitHub repository to [Render](https://render.com).
- Add Environment variables in Render dashboard.
- Build Command: `npm install; npx prisma generate`.
- Start Command: `node src/index.js`.

### Frontend (Vercel)
- Connect your repository to [Vercel](https://vercel.com).
- Add `VITE_API_URL` environment variable.
- Vercel will automatically detect Vite and deploy.

---

## 📄 Documentation for College Submission

- **Architecture**: Decoupled client-server architecture with REST API.
- **Security**: Implemented Helmet for headers, Rate limiting for API protection, and Bcrypt for data hashing.
- **AI Implementation**: Optimized prompt engineering for specific tools (Resume scoring, College bot).
- **Scalability**: Stateless JWT auth and modular folder structure allow for easy horizontal scaling.

---

## 👤 Author
Developed as part of the Full-Stack Engineering Portfolio.
