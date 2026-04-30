<p align="center">
  <img src="banner.png" alt="Sociofy Social Media App Banner" width="100%">
</p>

<h1 align="center">SOCIOFY</h1>

<p align="center">
  <strong>A premium, full-stack social media ecosystem built for the modern web.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge" alt="MERN Stack">
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma" alt="Prisma">
  <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind">
  <img src="https://img.shields.io/badge/Redux-Toolkit-764ABC?style=for-the-badge&logo=redux" alt="Redux">
</p>

---

## ✨ Overview

Sociofy is not just another social media app; it's a high-performance, scalable platform designed for seamless interaction. It combines the power of the **MERN stack** with the precision of **Prisma ORM** and the speed of **Redis caching** to deliver a premium user experience.

---

## 💎 Core Features

### 🔐 Secure Architecture
- **JWT-based Authentication**: State-of-the-art security with encrypted tokens.
- **Data Integrity**: Robust schema validation using Joi.
- **Privacy Controls**: Granular account privacy toggles (Public/Private).

### 🎬 Multimedia Mastery
- **Seamless Uploads**: Integrated with Cloudinary for high-speed image and video delivery.
- **Rich Feeds**: Dynamic, infinitely scrolling feeds with media previews.

### 🤝 Social Synergy
- **Real-time Interactions**: Instant likes, deep-threaded comments, and follow system.
- **Explore Dashboard**: Advanced discovery algorithms to find trending content.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React, Redux Toolkit, Tailwind CSS, Axios |
| **Backend** | Node.js, Express, Prisma, Multer |
| **Database** | PostgreSQL (Production Ready) |
| **Caching** | Redis (Optimized Performance) |
| **Storage** | Cloudinary (CDN Optimized) |
| **Security** | JWT, Bcrypt, Helmet, CORS |

---

## 🚀 Deployment & Setup

### Environment Configuration

Configure your `.env` variables for both `backend` and `frontend`:

```env
# Backend .env
DATABASE_URL=
JWT_SECRET=
CLOUDINARY_URL=
REDIS_URL=
```

### Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Database Sync
cd backend
npx prisma migrate dev

# 3. Launch Development Server
npm run dev
```

---

<p align="center">
  Built with excellence.
</p>
