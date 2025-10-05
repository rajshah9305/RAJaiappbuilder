# 🚀 Deployment Guide - RAJ AI APP BUILDER

## Quick Deploy to Vercel (Recommended)

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rajshah9305/RAJaiappbuilder)

### Manual Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy to Production**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `CEREBRAS_API_KEY` = `your-api-key-here`

## Environment Variables Required

| Variable | Required | Description | Where to Get |
|----------|----------|-------------|--------------|
| `CEREBRAS_API_KEY` | Yes | Cerebras Cloud API Key | [Get API Key](https://cerebras.ai/) |

## Vercel Configuration

The project includes a `vercel.json` configuration file with:

- **Build Command**: `npm run build`
- **Dev Command**: `npm run dev`
- **Install Command**: `npm install`
- **Framework**: Next.js
- **Function Timeout**: 60 seconds for API routes
- **Memory**: 1024 MB for API routes

## Build & Run Locally

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Platform-Specific Deployments

### AWS Amplify

1. Connect your GitHub repository
2. Set build settings:
   - Build command: `npm run build`
   - Output directory: `.next`
3. Add environment variable: `CEREBRAS_API_KEY`
4. Deploy

### Netlify

1. Connect GitHub repository
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Install Next.js plugin
4. Add environment variable
5. Deploy

### Railway

1. Create new project from GitHub
2. Add `CEREBRAS_API_KEY` environment variable
3. Railway auto-detects Next.js and deploys

### DigitalOcean App Platform

1. Create new app from GitHub
2. Configure:
   - Build command: `npm run build`
   - Run command: `npm start`
3. Add environment variable
4. Deploy

## Post-Deployment Checklist

- ✅ Verify environment variables are set
- ✅ Test the live URL
- ✅ Check API routes are working (`/api/generate`)
- ✅ Verify analytics tracking
- ✅ Test responsive design on mobile
- ✅ Check performance metrics

## Troubleshooting

### Build Fails

**Issue**: TypeScript errors during build
**Solution**: Run `npm run build` locally to debug

### API Not Working

**Issue**: `/api/generate` returns 500
**Solution**: Check if `CEREBRAS_API_KEY` is set correctly

### Slow Performance

**Issue**: App loads slowly
**Solution**: Verify Vercel Edge Network is enabled

### Environment Variables Not Loading

**Issue**: API key not found
**Solution**: Restart deployment after setting variables

## Performance Optimization

- ✅ Static generation enabled for main page
- ✅ API routes optimized with streaming
- ✅ Images optimized with Next.js Image
- ✅ CSS purged in production
- ✅ JavaScript minified and compressed

## Security Checklist

- ✅ API key stored in environment variables (not in code)
- ✅ API routes secured with proper headers
- ✅ Input sanitization implemented
- ✅ XSS protection enabled
- ✅ CORS configured properly

## Monitoring & Analytics

### Built-in Analytics
- User engagement tracking
- Generation metrics
- Category analytics
- Session time tracking

### Recommended External Tools
- **Vercel Analytics** - Web vitals and performance
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Mixpanel** - Advanced analytics

## Support

- 📧 Issues: [GitHub Issues](https://github.com/rajshah9305/RAJaiappbuilder/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/rajshah9305/RAJaiappbuilder/discussions)
- 📖 Docs: [README](README.md)

---

**Built with ❤️ by [Raj Shah](https://github.com/rajshah9305)**

**Powered by Cerebras GPT-OSS-120B**
