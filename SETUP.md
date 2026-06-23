# OJ Predict — Setup Guide

## Prerequisites
- Node.js 18+
- PostgreSQL database (Supabase recommended)
- Paystack business account
- API-Football (RapidAPI) account
- Anthropic API key
- Resend account (email)

---

## Quick Start

### 1. Configure Environment Variables
Copy `.env.local` and fill in all values:

```bash
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_SECRET="generate with: openssl rand -base64 32"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
FACEBOOK_CLIENT_ID=""
FACEBOOK_CLIENT_SECRET=""

# Payments
PAYSTACK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_test_..."

# Football Data
RAPIDAPI_KEY="..."

# AI
ANTHROPIC_API_KEY="sk-ant-..."

# Email
RESEND_API_KEY="re_..."

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 2. Set Up Database
```bash
# Push schema to database
npm run db:push

# Or run migrations
npm run db:migrate

# Seed with demo data (admin user + sample tips)
npm run db:seed
```

**Default Admin Login:**
- Email: `admin@ojpredict.com`
- Password: `Admin@OJPredict2026`

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Key URLs

| URL | Description |
|-----|-------------|
| `/` | Home page with today's tips |
| `/tips/over-25` | Free tips by category |
| `/winnings` | Results history |
| `/vip` | VIP subscription plans |
| `/blog` | Football news & articles |
| `/login` | User login |
| `/register` | User registration |
| `/dashboard` | User dashboard |
| `/admin` | Admin panel |

---

## Admin Panel Features

- **Tips Management** — Create, edit, publish, mark results
- **AI Queue** — Generate AI tips for upcoming matches, review & publish
- **Match Sync** — Pull fixtures from API-Football
- **Blog CMS** — Create and publish articles
- **Analytics** — Revenue, accuracy, users
- **User Management** — View all users and VIP subscribers

---

## Payment Setup (Paystack)
1. Register at [paystack.com](https://paystack.com)
2. Get your secret key from Dashboard → Settings → API Keys
3. Add webhook URL: `https://ojpredict.com/api/subscriptions/webhook`
4. Events to listen: `charge.success`, `subscription.disable`, `charge.failed`

---

## Football Data (API-Football)
1. Register at [rapidapi.com](https://rapidapi.com)
2. Subscribe to API-Football
3. Add your RapidAPI key to `.env.local`
4. Free tier: 100 calls/day | Pro: ~$15/month
5. Use Admin → Matches → Sync to pull today's fixtures

---

## AI Tips (Claude API)
1. Get API key from [console.anthropic.com](https://console.anthropic.com)
2. Admin → AI Queue → Select match → Generate AI Tip → Review → Publish
3. Auto-publishes if confidence > 80% (configurable)

---

## Deployment (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Or use: vercel env add <NAME>
```

---

## Tech Stack
- **Frontend**: Next.js 14 (App Router), Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js (Email + Google + Facebook)
- **Payments**: Paystack
- **AI**: Claude API (claude-sonnet-4-6)
- **Football Data**: API-Football (RapidAPI)
- **Email**: Resend
- **Hosting**: Vercel
