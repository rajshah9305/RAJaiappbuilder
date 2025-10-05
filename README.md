# NLP-to-App Platform

AI-powered platform that converts natural language into fully functional React applications. Built with Next.js 14, Cerebras AI, and E2B sandboxes.

## 🚀 Features

- **Multi-agent AI orchestration** - Product Manager, Architect, Coder, and QA agents collaborate
- **Real-time code generation** - Watch AI agents build your app step-by-step
- **Live preview** - Instant sandbox deployment with E2B
- **Full stack** - React components with Tailwind CSS styling
- **Test generation** - Automated Jest tests for every component

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **AI**: Cerebras API (llama3.1-70b)
- **Database**: Neon PostgreSQL (serverless)
- **Sandbox**: E2B (secure cloud sandboxes)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Cerebras API Key ([Get one here](https://cerebras.ai/))
- E2B API Key ([Get one here](https://e2b.dev/))
- Neon Database ([Get one here](https://neon.tech/))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/rajshah9305/NLPtoapp.git
cd NLPtoapp

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and add your API keys:
# CEREBRAS_API_KEY=your_key_here
# E2B_API_KEY=your_key_here
# DATABASE_URL=your_neon_db_url

# 4. Generate Prisma client
npx prisma generate
npx prisma db push

# 5. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Environment Variables

```bash
# Required
CEREBRAS_API_KEY=csk-xxxxx
E2B_API_KEY=e2b_xxxxx
DATABASE_URL=postgresql://user:pass@host/db
```

## 📚 API Endpoints

- `POST /api/generate` - Generate React component from natural language
- `POST /api/sandbox` - Deploy component to E2B sandbox

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Developed and Built with ❤️ by [Raj Shah](https://github.com/rajshah9305)**
