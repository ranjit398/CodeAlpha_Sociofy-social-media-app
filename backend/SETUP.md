# Backend Setup Guide

Complete step-by-step guide for setting up the Pulse Social Media Backend.

## Prerequisites

Before starting, ensure you have installed:
- [Node.js](https://nodejs.org/) 16 or higher
- [PostgreSQL](https://www.postgresql.org/download/) 12 or higher
- [Redis](https://redis.io/download) (optional for development)
- npm or yarn package manager

## 🔧 Quick Setup (5 minutes)

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Setup Environment Variables

Copy the example file and configure:

```bash
cp .env.example .env
```

Edit `.env` with your values. For local development, you can use `.env.local`:

```bash
cp .env.local .env
```

### Step 3: Create PostgreSQL Database

**Option A: Using psql command line**
```bash
createdb socialmedia_db
```

**Option B: Using psql interactive mode**
```bash
psql -U postgres
# Then in psql prompt:
CREATE DATABASE socialmedia_db;
\q
```

### Step 4: Initialize Prisma and Database

```bash
# Generate Prisma client
npm run prisma:generate

# Create database tables and run migrations
npm run prisma:migrate
# When prompted for migration name, enter: "init"
```

### Step 5: Start the Server

**Development (with hot reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will start at `http://localhost:5000`

---

## 📋 Detailed Setup

### PostgreSQL Setup

**1. Verify PostgreSQL is installed:**
```bash
psql --version
```

**2. Create a new database:**
```bash
# Using command line
createdb socialmedia_db

# Or using psql
psql -U postgres
CREATE DATABASE socialmedia_db;
```

**3. Update DATABASE_URL in .env:**
```env
DATABASE_URL=postgresql://USERNAME:PASSWORD@localhost:5432/socialmedia_db
```

Replace `USERNAME` and `PASSWORD` with your PostgreSQL credentials (default is `postgres` for both).

### Environment Variables

**Required Variables:**

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:pass@localhost:5432/socialmedia_db` |
| `JWT_ACCESS_SECRET` | Secret for access tokens | 64-char random hex |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | 64-char random hex |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account name | `my-cloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | From dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | From dashboard |

**Optional Variables:**

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Environment mode |
| `PORT` | `5000` | Server port |
| `JWT_ACCESS_EXPIRY` | `15m` | Access token validity |
| `JWT_REFRESH_EXPIRY` | `7d` | Refresh token validity |
| `REDIS_HOST` | `localhost` | Redis server host |
| `REDIS_PORT` | `6379` | Redis server port |
| `CLIENT_URL` | `http://localhost:3000` | Frontend URL for CORS |

### Generate Secure JWT Secrets

```bash
# Generate 64-character hex strings for JWT secrets
node -e "console.log('JWT_ACCESS_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('JWT_REFRESH_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

Add these to your `.env` file.

### Cloudinary Setup (Image Uploads)

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Go to Settings → API Keys
3. Copy the following to `.env`:
   - Cloud Name
   - API Key
   - API Secret
4. (Optional) Create an upload preset in Settings → Upload

```env
CLOUDINARY_CLOUD_NAME=abc123xyz
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=xyz987abc
```

### Redis Setup (Optional, for Caching)

Redis is optional for development. If not running, caching is disabled.

**Install Redis (macOS with Homebrew):**
```bash
brew install redis
brew services start redis
```

**Install Redis (Windows):**
- Download from [Redis on Windows](https://github.com/microsoftarchive/redis/releases)
- Or use WSL2 with Linux installation

**Verify Redis is running:**
```bash
redis-cli ping
# Should return: PONG
```

## 📊 Prisma Database Management

### View Database in Prisma Studio

```bash
npm run prisma:studio
```

Opens GUI at `http://localhost:5555`

### Create a New Migration

After modifying `schema.prisma`:

```bash
npm run prisma:migrate
# Name your migration, e.g., "add_user_bio"
```

### Inspect Generated SQL

```bash
prisma migrate resolve --applied "migration_name"
```

### Reset Database (Development Only)

⚠️ **This deletes all data!**

```bash
npx prisma migrate reset
```

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Node.js installed: `node --version`
- [ ] PostgreSQL running: `psql -U postgres -c "SELECT 1"`
- [ ] Database created: `psql -U postgres -l | grep socialmedia_db`
- [ ] Dependencies installed: `npm list | head -20`
- [ ] `.env` file created with all variables
- [ ] Prisma migrations ran: Check `prisma/migrations/` folder
- [ ] Server starts: `npm run dev` (should say listening on port 5000)
- [ ] Can access Prisma Studio: `npm run prisma:studio`

## 🐛 Common Issues & Solutions

### Issue: `Error: connect ECONNREFUSED 127.0.0.1:5432`
**Solution:** PostgreSQL is not running
```bash
# macOS
brew services start postgresql

# Linux
sudo service postgresql start

# Windows
# Start PostgreSQL service from Services app
```

### Issue: `Database socialmedia_db does not exist`
**Solution:** Create the database
```bash
createdb socialmedia_db
```

### Issue: `Invalid DATABASE_URL format`
**Solution:** Verify the connection string format
```
postgresql://username:password@localhost:5432/socialmedia_db
```

### Issue: `Prisma migration failed`
**Solution:** Reset and try again
```bash
npx prisma migrate reset
npm run prisma:migrate
```

### Issue: Redis connection refused
**Solution:** Redis is optional. If not needed, ignore or install Redis:
```bash
# macOS
brew install redis && brew services start redis
```

### Issue: Cloudinary upload fails
**Solution:** Verify credentials in Cloudinary dashboard
- Check Cloud Name, API Key, API Secret
- Ensure API Secret matches exactly

## 🚀 Next Steps

1. **Run the server:**
   ```bash
   npm run dev
   ```

2. **Test the API:**
   - Register: `POST http://localhost:5000/api/auth/register`
   - Check Prisma Studio: `npm run prisma:studio`

3. **Connect frontend:**
   - Update frontend API URL in `.env`
   - Ensure `CLIENT_URL` in backend matches frontend URL

4. **View logs:**
   - Server logs are printed to console
   - Check `NODE_ENV=development` for detailed logs

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [JWT Introduction](https://jwt.io/introduction)
- [Cloudinary Upload Documentation](https://cloudinary.com/documentation/upload_widget)

---

Need help? Check the logs or open an issue on GitHub!
