# strikeit

The simplest way to share to-do lists online. Minimal, fast, and free.

## Getting Started

### 1. Set up Upstash Redis
1. Create a free account at [Upstash](https://console.upstash.com/)
2. Create a new Redis database
3. Copy your Redis URL and token

### 2. Environment Variables
Create a `.env.local` file in the root directory:
```bash
UPSTASH_REDIS_REST_URL=your_redis_url_here
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here
```

### 3. Install and Run
```bash
npm install
npm run dev
```
Visit [strikeit](https://strikeit-dun.vercel.app) and start your list.

## Features
- Shareable lists by URL (e.g. `/my-list`)
- No login required
- Instant sync & persistence
- Rate-limited API
- Minimal UI, dark mode ready

## Deploy
Deploy instantly on [Vercel](https://vercel.com/) (free tier works great).

---
