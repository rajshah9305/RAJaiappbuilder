# NLP-to-App Platform

An enterprise-grade platform that converts natural language descriptions into fully functional web applications using AI. Built with Cerebras GPT-OSS-120B and featuring multi-agent orchestration, self-healing capabilities, and secure sandboxing.

## 🚀 Features

### Core Generation Engine
- **Multi-agent orchestration** with specialized AI agents (Architect, Frontend Developer, Backend Developer, Tester, Reviewer)
- **Autonomous self-healing loops** that detect and fix errors automatically
- **Versioned prompt management** with Jinja2 templates
- **Token-efficient generation** with vector similarity caching using ChromaDB

### Sandbox & Runtime
- **Secure container lifecycle** management with Docker
- **Automated build pipelines** (npm, Vite, Dockerfile generation)
- **Real-time console monitoring** with WebSocket connections
- **Hot reload and live patching** for instant feedback

### Self-Healing & Quality Gates
- **Automatic error detection** and repair using AI
- **Test generation** and execution (Jest, Vitest, Playwright)
- **Code quality enforcement** (ESLint, Prettier, TypeScript)
- **Compliance checking** and security scanning

### Advanced Features
- **Real-time collaboration** with WebSocket connections
- **Multi-modal input** (text, voice, images)
- **Enterprise security** with RBAC and audit logging
- **One-click deployment** to Vercel, AWS, or any cloud platform

## 🛠 Tech Stack

- **Backend**: FastAPI with Python 3.11
- **Frontend**: React 18 with TypeScript and Tailwind CSS
- **AI Model**: Cerebras GPT-OSS-120B via API
- **Database**: PostgreSQL with async SQLAlchemy
- **Cache**: Redis for session management and caching
- **Sandbox**: Docker containers with secure isolation
- **Deployment**: Vercel with automatic CI/CD
- **Real-time**: WebSocket connections for live updates

## 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   AI Services   │
│   React + TS    │◄──►│   FastAPI       │◄──►│   Cerebras      │
│   Tailwind CSS  │    │   WebSocket     │    │   Multi-Agent  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       │
         │              ┌─────────────────┐              │
         │              │   Database      │              │
         │              │   PostgreSQL    │              │
         │              │   Redis Cache   │              │
         │              └─────────────────┘              │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Sandbox       │    │   Self-Healing  │    │   Deployment    │
│   Docker        │    │   Error Fixing  │    │   Vercel/AWS    │
│   Live Preview  │    │   Auto-Testing  │    │   CI/CD         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- Docker and Docker Compose
- Cerebras API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nlp-to-app-platform.git
   cd nlp-to-app-platform
   ```

2. **Run the setup script**
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

3. **Configure environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your API keys
   ```

4. **Start the development environment**
   ```bash
   docker-compose up -d
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/api/docs

### Manual Setup

If you prefer manual setup:

```bash
# Install dependencies
npm install
cd backend && pip install -r requirements.txt
cd ../frontend && npm install

# Start services
docker-compose up -d postgres redis
npm run dev
```

## 🔧 Environment Variables

Create a `.env` file with the following variables:

```bash
# Cerebras AI Configuration
CEREBRAS_API_KEY=your_cerebras_api_key_here

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/nlptoapp

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Security
JWT_SECRET=your_jwt_secret_here
ENCRYPTION_KEY=your_encryption_key_here

# External Services
GITHUB_TOKEN=your_github_token_here
VERCEL_TOKEN=your_vercel_token_here
```

## 📚 API Documentation

### Core Endpoints

- **POST** `/api/v1/generations/` - Create new code generation
- **GET** `/api/v1/generations/{id}/status` - Get generation status
- **GET** `/api/v1/generations/{id}/artifacts` - Get generated code
- **POST** `/api/v1/sandboxes/` - Create sandbox environment
- **GET** `/api/v1/sandboxes/{id}/status` - Get sandbox status
- **WebSocket** `/ws/{client_id}` - Real-time updates

### WebSocket Events

- `generation_update` - Generation progress updates
- `sandbox_update` - Sandbox status changes
- `console_log` - Real-time console output
- `error` - Error notifications

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy**
   ```bash
   ./scripts/deploy.sh
   ```

3. **Set environment variables in Vercel dashboard**

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   cd backend && pip install -r requirements.txt
   ```

2. **Deploy backend** to your preferred platform (AWS, GCP, Azure)
3. **Deploy frontend** to Vercel, Netlify, or any static hosting
4. **Configure environment variables** on your hosting platform

## 🧪 Testing

```bash
# Run all tests
npm test

# Run backend tests
cd backend && python -m pytest

# Run frontend tests
cd frontend && npm test

# Run integration tests
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

## 🔒 Security Features

- **Secure sandboxing** with Docker containers
- **Input validation** and sanitization
- **Rate limiting** and DDoS protection
- **Authentication** with JWT tokens
- **Audit logging** for compliance
- **CORS** and security headers
- **Environment isolation** for sensitive data

## 📊 Monitoring & Observability

- **Health checks** for all services
- **Real-time metrics** and logging
- **Error tracking** with detailed stack traces
- **Performance monitoring** with Core Web Vitals
- **Usage analytics** and cost tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation
- Ensure all tests pass
- Follow security best practices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Cerebras Systems](https://cerebras.net/) for providing the AI model
- [FastAPI](https://fastapi.tiangolo.com/) for the excellent Python framework
- [React](https://reactjs.org/) and [Tailwind CSS](https://tailwindcss.com/) for the frontend
- [Docker](https://www.docker.com/) for containerization
- [Vercel](https://vercel.com/) for deployment platform

## 📞 Support

- **Documentation**: [docs.nlp-to-app.com](https://docs.nlp-to-app.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/nlp-to-app-platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/nlp-to-app-platform/discussions)
- **Email**: support@nlp-to-app.com

---

**Built with ❤️ by the NLP-to-App Team**
