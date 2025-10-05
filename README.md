# RAJ AI APP BUILDER

Elite AI-powered platform that converts natural language into fully functional React applications with real-time streaming. Built by Raj Shah using Next.js 14 and Cerebras GPT-OSS-120B.

## ✨ Features

- **Real-time streaming** - Watch AI generate code token by token
- **Monaco Editor** - Professional code editor with syntax highlighting
- **Server-Sent Events** - Live progress updates
- **Production-ready** - No mocks, no fallbacks
- **Elite UI** - Cyan/Emerald gradient theme with animated backgrounds
- **Instant preview** - Live React component rendering

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **AI Model**: Cerebras GPT-OSS-120B (streaming)
- **Editor**: Monaco Editor
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

**RAJ AI APP BUILDER - Developed and Built with ❤️ by [Raj Shah](https://github.com/rajshah9305)**
