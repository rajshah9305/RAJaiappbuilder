# Project Structure

This document outlines the essential files in the NLP-to-App Next.js application.

## 📁 Core Structure

```
nlp-to-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── generate/      # Code generation endpoint
│   │   │   └── sandbox/       # Sandbox management endpoint
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── AgentProgress.tsx  # Agent progress UI
│   │   ├── CodeViewer.tsx     # Code preview UI
│   │   └── PromptInput.tsx    # User input UI
│   └── lib/                   # Utilities
│       ├── ai/                # AI orchestration
│       ├── sandbox/           # Sandbox management
│       └── db.ts              # Prisma client
├── prisma/
│   └── schema.prisma          # Database schema
├── .env                       # Environment variables (gitignored)
├── .env.example               # Environment template
├── .gitignore                 # Git ignore rules
├── deploy-vercel.sh           # Deployment script
├── next.config.js             # Next.js configuration
├── package.json               # Dependencies
├── postcss.config.js          # PostCSS configuration
├── README.md                  # Main documentation
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── vercel.json                # Vercel deployment config
```

## ✅ Essential Files

### Configuration
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `vercel.json` - Vercel deployment settings

### Source Code
- `src/app/` - Next.js pages and API routes
- `src/components/` - React UI components
- `src/lib/` - Utility functions and services

### Database
- `prisma/schema.prisma` - Database schema

### Environment
- `.env` - Environment variables (not committed)
- `.env.example` - Environment template

### Documentation
- `README.md` - Main documentation
- `DEPLOYMENT_FIX.md` - Deployment guide

### Scripts
- `deploy-vercel.sh` - Vercel deployment
- `test-db.sh` - Database testing

## 🗑️ Removed Files

The following were removed as they're not needed for the Next.js version:

- `backend/` - Python FastAPI backend (replaced by Next.js API routes)
- `frontend/` - Vite React frontend (replaced by Next.js)
- `docker-compose.yml` - Docker configuration (using Vercel)
- `nginx.conf` - Nginx configuration (Vercel handles routing)
- `scripts/` - Old setup scripts (using Vercel CLI)
- Redundant documentation files (consolidated into README.md)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run development server
npm run dev

# Deploy to Vercel
./deploy-vercel.sh
```

## 📝 Notes

- All Python backend logic has been migrated to Next.js API routes
- Docker is no longer needed - using Vercel for deployment
- Database uses Neon PostgreSQL (serverless)
- Redis uses Upstash (serverless)
- Sandboxes use E2B API (cloud-based)

---

**Developed and Built by [Raj Shah](https://github.com/rajshah9305)**
