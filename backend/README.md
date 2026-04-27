# Pulse Backend - Social Media API

A modern, scalable social media backend API built with Node.js, Express, Prisma, and PostgreSQL.

## 🚀 Features

- **User Authentication** - JWT-based auth with token rotation
- **Posts & Feed** - Create, read, update, delete posts with image support
- **Comments** - Add comments to posts with pagination
- **Likes** - Like/unlike posts
- **Follow System** - Follow/unfollow users
- **Caching** - Redis-based caching for improved performance
- **File Uploads** - Cloudinary integration for image uploads
- **Rate Limiting** - API rate limiting for security
- **Error Handling** - Comprehensive error handling
- **Logging** - Pino-based structured logging

## 📋 Prerequisites

- **Node.js** 16+ and npm/yarn
- **PostgreSQL** 12+ database
- **Redis** for caching (optional for development)
- **Cloudinary** account for image uploads
- **Environment variables** configured

## 🔧 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Copy the `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

**Required environment variables:**
```env
# Application
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/socialmedia_db

# JWT
JWT_ACCESS_SECRET=<generate-secure-secret>
JWT_REFRESH_SECRET=<generate-secure-secret>

# Redis (optional, defaults to localhost:6379)
REDIS_HOST=localhost
REDIS_PORT=6379

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

# Frontend URL
CLIENT_URL=http://localhost:3000
```

**Generate secure JWT secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Setup PostgreSQL database

Ensure PostgreSQL is running and create the database:

```bash
createdb socialmedia_db
```

Or in psql:
```sql
CREATE DATABASE socialmedia_db;
```

### 5. Setup Prisma and create tables

Generate Prisma client and run migrations:

```bash
# Generate Prisma client
npm run prisma:generate

# Create tables (this creates the first migration)
npm run prisma:migrate
```

You will be prompted to name the migration. Enter something like `init` for the first migration.

Verify your schema with Prisma Studio:
```bash
npm run prisma:studio
```

## 🗄️ Database Schema

### Models

- **User** - User accounts with authentication
- **Post** - Social media posts
- **Comment** - Comments on posts
- **Like** - Post likes
- **Follow** - User follow relationships
- **RefreshToken** - JWT refresh tokens for rotation

See `prisma/schema.prisma` for detailed schema definition.

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/:username` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/:username/posts` - Get user's posts

### Posts
- `GET /api/posts` - Get global feed
- `POST /api/posts` - Create post
- `GET /api/posts/:id` - Get post details
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like post
- `DELETE /api/posts/:id/like` - Unlike post

### Comments
- `GET /api/posts/:postId/comments` - Get post comments
- `POST /api/posts/:postId/comments` - Add comment
- `DELETE /api/posts/:postId/comments/:commentId` - Delete comment

### Follow
- `POST /api/follow/:username` - Follow user
- `DELETE /api/follow/:username` - Unfollow user
- `GET /api/users/:username/followers` - Get followers
- `GET /api/users/:username/following` - Get following list

## 🚀 Running the server

### Development (with hot reload)
```bash
npm run dev
```

### Production
```bash
npm start
```

The API will be available at `http://localhost:5000`

## 🧪 Testing

Run tests:
```bash
npm test
```

Watch mode:
```bash
npm run test:watch
```

## 📁 Project Structure

```
src/
├── config/           # Configuration (database, JWT, Redis, Cloudinary)
├── middleware/       # Express middleware
├── modules/          # Feature modules (auth, user, post, etc.)
│   ├── auth/        # Authentication module
│   ├── user/        # User management
│   ├── post/        # Posts module
│   ├── comment/     # Comments module
│   ├── follow/      # Follow system
│   ├── feed/        # Feed generation
│   └── upload/      # File uploads
├── utils/           # Utilities (error handling, logging, cache)
├── app.js           # Express app setup
└── server.js        # Server entry point

prisma/
├── schema.prisma    # Database schema
└── migrations/      # Database migrations
```

## 🔐 Security

- Passwords hashed with bcryptjs
- JWT token rotation
- Rate limiting on all endpoints
- CORS enabled for frontend
- Helmet for secure HTTP headers
- Input validation with Joi

## 📦 Dependencies

- **express** - Web framework
- **@prisma/client** - Database ORM
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **ioredis** - Redis client
- **cloudinary** - Image hosting
- **joi** - Input validation
- **multer** - File uploads
- **pino** - Logging
- **cors** - Cross-origin support
- **helmet** - Security headers
- **morgan** - HTTP request logging

## 🐛 Troubleshooting

### Database connection issues
- Verify PostgreSQL is running
- Check `DATABASE_URL` format
- Ensure database exists and is accessible

### Prisma migration issues
- Run `npm run prisma:generate` to regenerate client
- Check migration files in `prisma/migrations/`
- Use `prisma:studio` to visualize data

### Redis connection issues
- Verify Redis is running (default: `localhost:6379`)
- Check `REDIS_HOST` and `REDIS_PORT` in `.env`
- Can run without Redis (caching disabled)

### Cloudinary issues
- Verify credentials are correct
- Check API keys in Cloudinary dashboard
- Ensure upload folder is configured

## 📝 License

MIT License - feel free to use this for your projects!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests.
