<div align="center">

# RAJ AI APP BUILDER

### Enterprise-Grade AI-Powered Application Generator

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**Transform natural language descriptions into production-ready React applications with real-time AI streaming**

[Live Demo](https://nlptoapp.vercel.app) • [Documentation](#documentation) • [Report Bug](https://github.com/rajshah9305/NLPtoapp/issues) • [Request Feature](https://github.com/rajshah9305/NLPtoapp/issues)

</div>

---

## 🎯 Overview

RAJ AI APP BUILDER is an enterprise-grade platform that leverages Cerebras GPT-OSS-120B to convert natural language specifications into fully functional, production-ready React applications. Built with Next.js 14 and featuring real-time streaming capabilities, it provides developers with an intuitive interface to rapidly prototype and generate applications.

### Key Highlights

- 🚀 **Real-Time Streaming**: Watch AI generate code token-by-token with Server-Sent Events
- 💻 **Professional Code Editor**: Integrated Monaco Editor with syntax highlighting and IntelliSense
- 📱 **Fully Responsive**: Optimized for all devices from mobile (320px) to desktop (1920px+)
- ⚡ **Instant Preview**: Live React component rendering with hot reload
- 🎨 **Modern UI/UX**: Gradient-based design system with animated backgrounds
- 🔒 **Production-Ready**: No mocks, no fallbacks - enterprise-grade implementation
- 🧪 **Automated Testing**: AI-generated test suites for every component
- 📊 **Agent Progress Tracking**: Visual feedback for multi-stage generation process

---

## 🏗️ Architecture

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|----------|
| **Frontend** | Next.js 14 (App Router) | React framework with server components |
| **Language** | TypeScript 5.3 | Type-safe development |
| **Styling** | Tailwind CSS 3.3 | Utility-first CSS framework |
| **AI Model** | Cerebras GPT-OSS-120B | High-performance language model |
| **Code Editor** | Monaco Editor | VS Code-powered editing experience |
| **Deployment** | Vercel | Edge network deployment |

### System Architecture

```
┌─────────────────┐
│   User Input    │
│  (Natural Lang) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Next.js API    │
│   /api/generate │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Cerebras GPT    │
│  Streaming API  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  SSE Stream     │
│  (Real-time)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  React UI       │
│  Monaco Editor  │
│  Live Preview   │
└─────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Cerebras API Key**: [Get your key](https://cerebras.ai/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rajshah9305/NLPtoapp.git
   cd NLPtoapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Cerebras API key:
   ```env
   CEREBRAS_API_KEY=csk-your-api-key-here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 📖 Documentation

### API Reference

#### `POST /api/generate`

Generates React application code from natural language description.

**Request Body:**
```json
{
  "prompt": "Create a todo list app with dark mode and local storage"
}
```

**Response:** Server-Sent Events (SSE) stream

**Event Types:**
- `code` - Component code generation progress
- `test` - Test suite generation progress
- `done` - Generation complete with metadata

**Example Response Stream:**
```javascript
data: {"stage":"code","status":"streaming","content":"import React"}
data: {"stage":"code","status":"complete","fullContent":"..."}
data: {"stage":"test","status":"streaming","content":"describe"}
data: {"stage":"test","status":"complete","fullContent":"..."}
data: {"stage":"done","spec":"...","arch":"..."}
```

### Component Structure

```
src/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # Streaming API endpoint
│   ├── globals.css               # Global styles & responsive utilities
│   ├── layout.tsx                # Root layout with metadata
│   └── page.tsx                  # Main application page
└── components/
    ├── AgentProgress.tsx         # Multi-stage progress indicator
    ├── CodeViewer.tsx            # Monaco editor & preview tabs
    └── PromptInput.tsx           # Natural language input interface
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `CEREBRAS_API_KEY` | Yes | Your Cerebras Cloud API key |

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rajshah9305/NLPtoapp)

**Manual Deployment:**

1. Install Vercel CLI
   ```bash
   npm i -g vercel
   ```

2. Deploy to production
   ```bash
   vercel --prod
   ```

3. Add environment variables in Vercel Dashboard:
   - Navigate to Project Settings → Environment Variables
   - Add `CEREBRAS_API_KEY` with your API key

### Deploy to Other Platforms

The application can be deployed to any platform supporting Next.js:
- **AWS Amplify**
- **Netlify**
- **Railway**
- **DigitalOcean App Platform**

---

## 💡 Usage Examples

### Example Prompts

1. **Todo Application**
   ```
   Create a todo list app with drag and drop, dark mode toggle, 
   and local storage persistence
   ```

2. **Weather Dashboard**
   ```
   Build a weather dashboard with current conditions, 5-day forecast, 
   and location search using a modern card layout
   ```

3. **Calculator**
   ```
   Design a scientific calculator with basic operations, memory functions, 
   and keyboard support
   ```

4. **Pomodoro Timer**
   ```
   Create a Pomodoro timer with customizable work/break intervals, 
   notifications, and session history
   ```

---

## 🎨 Features in Detail

### Real-Time Streaming
- Token-by-token code generation
- Live progress updates via Server-Sent Events
- Multi-stage generation tracking (Analysis → Code → Tests → Finalization)

### Monaco Editor Integration
- Full VS Code editing experience
- Syntax highlighting for JavaScript/TypeScript
- Responsive font sizing and word wrap
- Read-only mode for generated code

### Responsive Design
- Mobile-first approach (320px+)
- Tablet optimization (768px+)
- Desktop enhancement (1024px+)
- Large screen support (1920px+)

### Live Preview
- Instant React component rendering
- Sandboxed iframe execution
- Automatic Tailwind CSS injection
- Hot reload on code changes

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Maintain responsive design principles
- Write meaningful commit messages
- Update documentation for new features
- Ensure all builds pass before submitting PR

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Cerebras** - For providing the GPT-OSS-120B model
- **Vercel** - For Next.js framework and hosting platform
- **Monaco Editor** - For the professional code editing experience
- **Tailwind CSS** - For the utility-first CSS framework

---

## 📧 Contact & Support

**Developer:** Raj Shah

- GitHub: [@rajshah9305](https://github.com/rajshah9305)
- Repository: [NLPtoapp](https://github.com/rajshah9305/NLPtoapp)

### Support

- 🐛 [Report Bug](https://github.com/rajshah9305/NLPtoapp/issues)
- 💡 [Request Feature](https://github.com/rajshah9305/NLPtoapp/issues)
- 📖 [Documentation](https://github.com/rajshah9305/NLPtoapp#documentation)

---

<div align="center">

**RAJ AI APP BUILDER**

Developed and Built with ❤️ by [Raj Shah](https://github.com/rajshah9305)

Powered by Cerebras GPT-OSS-120B

⭐ Star this repository if you find it helpful!

</div>
