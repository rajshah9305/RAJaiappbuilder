# AI App Factory

Elite AI-powered platform that converts natural language into fully functional React applications with real-time streaming. Built with Next.js 14 and Cerebras GPT-OSS-120B.

## ✨ Features

- **Real-time streaming** - Watch AI generate code token by token
- **Server-Sent Events** - Live progress updates
- **Production-ready** - No mocks, no fallbacks
- **Beautiful UI** - Tailwind CSS with smooth animations
- **Instant preview** - Live React component rendering

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **AI Model**: Cerebras GPT-OSS-120B (streaming)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/rajshah9305/NLPtoapp.git
cd NLPtoapp

# Install dependencies
npm install

# Set environment variable
echo "CEREBRAS_API_KEY=your_key_here" > .env

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

```bash
CEREBRAS_API_KEY=csk-xxxxx
```

Get your API key from [Cerebras Cloud](https://cerebras.ai/)

## 📚 API

- `POST /api/generate` - Streaming code generation with SSE

## 🚀 Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

Add `CEREBRAS_API_KEY` in Vercel dashboard.

## 📄 License

MIT License

---

**Developed and Built with ❤️ by [Raj Shah](https://github.com/rajshah9305)**
