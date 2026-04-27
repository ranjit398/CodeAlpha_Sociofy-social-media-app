# 🌐 Pulse — Modern Social Media Platform

Pulse is a full-stack social media application designed for seamless interaction, multimedia sharing, and robust user engagement. Built with the MERN stack (MongoDB, Express, React, Node.js) and enhanced with modern tools like Prisma, Redux Toolkit, and Tailwind CSS.

---

## 🚀 Features

- **👤 User Authentication**: Secure signup and login using JWT and Bcrypt.
- **📸 Multimedia Posts**: Share images and videos with Cloudinary integration.
- **💬 Real-time Interactions**: Like, comment, and follow functionality.
- **🛡️ Account Privacy**: Toggle between public and private accounts.
- **🔍 Explore Dashboard**: Discover trending content and new users.
- **📱 Responsive Design**: Fully optimized for mobile and desktop with Tailwind CSS.
- **⚡ Performance**: Fast data fetching and state management with Redux Toolkit and Prisma.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Navigation**: React Router DOM
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (via Prisma ORM)
- **Caching**: Redis
- **Storage**: Cloudinary (Multimedia)
- **Validation**: Joi
- **Logging**: Pino & Morgan

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- Redis
- Cloudinary Account

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/pulse-social.git
   cd pulse-social
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```
   - Create a `.env` file in the `backend` directory (refer to `.env.example`).
   - Run migrations:
     ```bash
     npx prisma migrate dev
     ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   ```
   - Create a `.env` file in the `frontend` directory.

### Running the App

1. **Start Backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm start
   ```

---

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

Built with ❤️ by [RAJ MAURYA](https://github.com/your-username)
