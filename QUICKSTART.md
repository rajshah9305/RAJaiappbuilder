# 🚀 Quick Start Guide

## ✅ System Status

**All servers are running!**

- ✅ PostgreSQL: `localhost:5432` (healthy)
- ✅ Redis: `localhost:6379` (healthy)  
- ✅ Next.js App: `http://localhost:3000` (running)
- ✅ Database: SQLite initialized with Prisma

## 🎯 Access Your Application

**Frontend:** http://localhost:3000

## 🔑 Configuration

Your Cerebras API key is configured:
```
CEREBRAS_API_KEY=csk-48ey6ck36ccr6eep9hp4t8dkyhfn8858kmwwc9xx93h8kmc9
```

## 🎨 How to Use

1. **Open your browser** to http://localhost:3000
2. **Enter a prompt** like:
   - "Create a todo list app with React"
   - "Build a weather dashboard"
   - "Make a calculator with dark mode"
3. **Click Generate** - Cerebras AI will create your app
4. **View the code** in the right panel

## 🛠 Tech Stack

- **Frontend:** Next.js 14 + React 18 + Tailwind CSS
- **AI:** Cerebras Llama 3.1 70B
- **Database:** SQLite (local) / PostgreSQL (production)
- **Multi-Agent:** PM → Architect → Coder → QA

## 📝 Available Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:push      # Update database schema
npm run db:studio    # Open Prisma Studio
```

## 🔄 Restart Services

```bash
# Stop Next.js
kill $(cat server.pid)

# Restart Next.js
npm run dev

# Stop Docker services
docker-compose down

# Start Docker services
docker-compose up -d postgres redis
```

## 📊 Database

View your database with Prisma Studio:
```bash
npm run db:studio
```

## 🎉 You're Ready!

Your AI App Factory is fully operational. Start generating apps with natural language!
