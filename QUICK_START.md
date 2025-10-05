# 🚀 Quick Start Guide - RAJ AI APP BUILDER

## ✅ System Status: FULLY OPERATIONAL

### 1. Installation (30 seconds)

```bash
# Clone repository
git clone https://github.com/rajshah9305/NLPtoapp.git
cd NLPtoapp

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Add your Cerebras API key to .env
```

### 2. Configuration (10 seconds)

Edit `.env`:
```env
CEREBRAS_API_KEY=csk-your-api-key-here
```

Get your API key: https://cerebras.ai/

### 3. Run (5 seconds)

```bash
npm run dev
```

Open: http://localhost:3000

### 4. Usage

1. **Enter a prompt**: "Create a todo app with dark mode"
2. **Click Generate**: Watch AI create code in real-time
3. **View Preview**: See your app running live
4. **Copy/Download**: Use the generated code

### Features Working ✅

- ✅ **Code Generation**: AI creates React components
- ✅ **Live Preview**: Instant rendering in browser
- ✅ **Real-time Streaming**: Watch code appear token-by-token
- ✅ **Test Generation**: Auto-generated test suites
- ✅ **Toast Notifications**: Success/error feedback
- ✅ **Progress Tracking**: Visual generation stages
- ✅ **Copy/Download/Share**: Easy code export
- ✅ **Responsive Design**: Works on all devices

### Example Prompts

```
✨ Create a modern todo list with drag and drop
🎨 Build a portfolio website with smooth animations
📊 Design an analytics dashboard with charts
🎮 Make an interactive memory card game
🛒 Create an e-commerce product catalog
💬 Build a real-time chat interface
```

### Preview System

**How it works:**
1. AI generates React component code
2. Code streams to CodeViewer component
3. HTML generated with React + Babel + Tailwind
4. Iframe renders component with sandbox permissions
5. Live preview updates in real-time (300ms debounce)

**What's supported:**
- ✅ React hooks (useState, useEffect, etc.)
- ✅ Tailwind CSS styling
- ✅ Event handlers (onClick, onChange, etc.)
- ✅ Conditional rendering
- ✅ Lists and maps
- ✅ Forms and inputs
- ✅ Animations and transitions

### Troubleshooting

**Preview not showing?**
- Already fixed! Update to latest commit
- Sandbox permissions: `allow-scripts allow-same-origin`

**Code not generating?**
- Check CEREBRAS_API_KEY in .env
- Verify internet connection
- Check API quota/limits

**Build errors?**
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Project Structure

```
src/
├── app/
│   ├── api/generate/route.ts    # AI streaming API
│   ├── page.tsx                 # Main application
│   └── globals.css              # Design system
├── components/
│   ├── CodeViewer.tsx           # Code/Preview/Tests tabs
│   ├── PromptInput.tsx          # Input interface
│   ├── AgentProgress.tsx        # Progress tracking
│   ├── Toast.tsx                # Notifications
│   └── AnalyticsDashboard.tsx   # Analytics
└── lib/
    └── personalization.ts       # AI personalization
```

### Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

### Tech Stack

- **Framework**: Next.js 14.2.33
- **Language**: TypeScript 5.3.3
- **Styling**: Tailwind CSS 3.3.6
- **AI Model**: Cerebras GPT-OSS-120B
- **Editor**: Monaco Editor 4.7.0
- **Deployment**: Vercel

### Verification

```bash
✓ TypeScript: 0 errors
✓ ESLint: 0 warnings
✓ Build: Passing
✓ Security: 0 vulnerabilities
✓ Bundle: 103 kB (optimized)
```

### Documentation

- **README.md** - Full documentation
- **PREVIEW_VERIFICATION.md** - Preview system details
- **SYSTEM_STATUS.md** - Complete system status
- **QUICK_START.md** - This guide

### Support

- **GitHub**: https://github.com/rajshah9305/NLPtoapp
- **Issues**: https://github.com/rajshah9305/NLPtoapp/issues
- **Developer**: @rajshah9305

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rajshah9305/NLPtoapp)

Or manually:
```bash
npm i -g vercel
vercel --prod
```

Add `CEREBRAS_API_KEY` in Vercel dashboard.

---

## 🎉 You're Ready!

The system is **fully operational** and ready to generate amazing React applications!

**Start building**: http://localhost:3000

---

**Built by RAJ SHAH** | **Powered by Cerebras GPT-OSS-120B**
