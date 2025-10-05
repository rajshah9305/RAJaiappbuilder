# Test Checklist

## ✅ Build & Compilation
- [x] TypeScript compiles without errors
- [x] Production build succeeds
- [x] All routes generated correctly
- [x] No missing dependencies

## ✅ Core Functionality
- [x] API route `/api/generate` exists
- [x] API route `/api/sandbox` exists
- [x] Database client configured
- [x] AI orchestrator with Cerebras API
- [x] Fallback code when API fails

## ✅ UI Components
- [x] PromptInput component
- [x] CodeViewer component with tabs
- [x] AgentProgress component
- [x] Main page layout

## ✅ Features
- [x] Multi-agent workflow (PM, Architect, Coder, QA)
- [x] Real-time progress tracking
- [x] Code preview in iframe
- [x] Code tab showing generated JSX
- [x] Test tab showing generated tests
- [x] Rate limit handling with retries
- [x] Exponential backoff (1s, 2s, 4s, 8s)
- [x] 30s timeout per request
- [x] Fallback Counter example

## ✅ Preview System
- [x] React 18 loaded via CDN
- [x] Babel for JSX transformation
- [x] Tailwind CSS via CDN
- [x] useState, useEffect, useRef available
- [x] Handles export default syntax
- [x] Error display if preview fails

## ✅ API Integration
- [x] Cerebras API endpoint configured
- [x] Model: llama3.1-8b
- [x] Max tokens: 1500
- [x] Temperature: 0.7
- [x] Retry logic: 3 attempts

## ✅ Database
- [x] Prisma schema defined
- [x] Project and Build models
- [x] Database client exported

## ✅ Deployment Ready
- [x] vercel.json configured
- [x] .env.example provided
- [x] README with instructions
- [x] DEPLOY.md with steps
- [x] No build artifacts in repo
- [x] .gitignore configured

## 🧪 Manual Testing Required
- [ ] Deploy to Vercel
- [ ] Add CEREBRAS_API_KEY env var
- [ ] Add DATABASE_URL env var
- [ ] Test prompt: "counter app"
- [ ] Verify preview renders
- [ ] Verify code tab shows JSX
- [ ] Verify test tab shows tests
- [ ] Test with rate limit (multiple requests)
- [ ] Verify fallback works

## 📊 Expected Behavior
1. User enters prompt
2. 5 agents show progress
3. Code generates (or fallback)
4. Preview tab shows working React app
5. Code tab shows clean JSX
6. Test tab shows Jest tests
