# Code Index - NLP-to-App Platform

## 📁 Project Structure

### Backend (`/backend`)
FastAPI-based backend with AI orchestration and sandbox management.

#### API Layer (`/backend/app/api/v1/`)
- **`api.py`** - Main API router configuration
- **`endpoints/`** - API endpoint modules
  - `auth.py` - Authentication & authorization endpoints
  - `generations.py` - Code generation endpoints
  - `health.py` - Health check endpoints
  - `projects.py` - Project management endpoints
  - `sandboxes.py` - Sandbox lifecycle endpoints
  - `tests.py` - Test execution endpoints

#### Core (`/backend/app/core/`)
- **`config.py`** - Application configuration & settings
- **`database.py`** - PostgreSQL database connection & session management
- **`redis_client.py`** - Redis cache client
- **`websocket_manager.py`** - WebSocket connection manager for real-time updates

#### Models (`/backend/app/models/`)
- **`generation.py`** - Code generation data models
- **`project.py`** - Project data models
- **`sandbox.py`** - Sandbox environment models
- **`test_result.py`** - Test execution result models
- **`user.py`** - User authentication models

#### Services (`/backend/app/services/`)
- **`ai_service.py`** - Cerebras AI integration & multi-agent orchestration
- **`code_generator.py`** - Code generation engine with template management
- **`sandbox_manager.py`** - Docker container lifecycle management
- **`self_healing.py`** - Autonomous error detection & repair

#### Prompts (`/backend/app/prompts/`)
- **`system_prompt.j2`** - Jinja2 template for AI system prompts

#### Entry Points
- **`main.py`** - Production FastAPI application entry point
- **`simple_main.py`** - Simplified development server
- **`requirements.txt`** - Python dependencies
- **`Dockerfile`** - Backend container configuration

---

### Frontend (`/frontend`)
React 18 + TypeScript + Tailwind CSS frontend application.

#### Components (`/frontend/src/components/`)
- **`CodeEditor/`**
  - `CodeEditor.tsx` - Monaco-based code editor component
- **`Generation/`**
  - `ArtifactViewer.tsx` - Generated code artifact viewer
  - `GenerationProgress.tsx` - Real-time generation progress indicator
- **`Layout/`**
  - `Header.tsx` - Application header with navigation
  - `Layout.tsx` - Main layout wrapper
  - `Sidebar.tsx` - Navigation sidebar

#### Contexts (`/frontend/src/contexts/`)
- **`AppContext.tsx`** - Global application state context
- **`WebSocketContext.tsx`** - WebSocket connection context for real-time updates

#### Hooks (`/frontend/src/hooks/`)
- **`useTheme.ts`** - Theme management hook (dark/light mode)

#### Pages (`/frontend/src/pages/`)
- **`HomePage.tsx`** - Landing page with NLP input
- **`DashboardPage.tsx`** - User dashboard overview
- **`GenerationPage.tsx`** - Code generation interface
- **`ProjectsPage.tsx`** - Project management page
- **`SandboxPage.tsx`** - Live sandbox preview & console
- **`SettingsPage.tsx`** - User settings & preferences

#### Stores (`/frontend/src/stores/`)
- **`appStore.ts`** - Zustand store for app state
- **`generationStore.ts`** - Zustand store for generation state

#### Entry Points & Config
- **`main.tsx`** - React application entry point
- **`App.tsx`** - Root application component with routing
- **`index.css`** - Global styles & Tailwind imports
- **`vite.config.ts`** - Vite build configuration
- **`tsconfig.json`** - TypeScript configuration
- **`tailwind.config.js`** - Tailwind CSS configuration
- **`package.json`** - Frontend dependencies
- **`Dockerfile`** - Frontend container configuration

---

### Scripts (`/scripts`)
- **`setup.sh`** - Automated project setup script
- **`deploy.sh`** - Deployment automation script

---

### Configuration Files (Root)
- **`docker-compose.yml`** - Multi-container orchestration
- **`env.example`** - Environment variable template
- **`nginx.conf`** - Nginx reverse proxy configuration
- **`vercel.json`** - Vercel deployment configuration
- **`package.json`** - Root package configuration
- **`.gitignore`** - Git ignore rules

---

## 🔑 Key Components

### Multi-Agent System
Located in `/backend/app/services/ai_service.py`:
- Architect Agent - System design & architecture
- Frontend Developer Agent - React/TypeScript code generation
- Backend Developer Agent - API & database code generation
- Tester Agent - Test generation & execution
- Reviewer Agent - Code quality & security review

### Self-Healing Loop
Located in `/backend/app/services/self_healing.py`:
- Error detection from build/runtime logs
- Automatic fix generation using AI
- Iterative repair with max retry limits
- Quality gate enforcement

### Sandbox Management
Located in `/backend/app/services/sandbox_manager.py`:
- Docker container lifecycle (create, start, stop, destroy)
- Build pipeline automation (npm install, vite build)
- Real-time console streaming via WebSocket
- Hot reload & live patching

### WebSocket Communication
- Backend: `/backend/app/core/websocket_manager.py`
- Frontend: `/frontend/src/contexts/WebSocketContext.tsx`
- Events: generation_update, sandbox_update, console_log, error

---

## 🚀 API Endpoints

### Generations
- `POST /api/v1/generations/` - Create generation
- `GET /api/v1/generations/{id}/status` - Get status
- `GET /api/v1/generations/{id}/artifacts` - Get code

### Sandboxes
- `POST /api/v1/sandboxes/` - Create sandbox
- `GET /api/v1/sandboxes/{id}/status` - Get status
- `DELETE /api/v1/sandboxes/{id}` - Destroy sandbox

### Projects
- `GET /api/v1/projects/` - List projects
- `POST /api/v1/projects/` - Create project
- `GET /api/v1/projects/{id}` - Get project details

### Tests
- `POST /api/v1/tests/run` - Execute tests
- `GET /api/v1/tests/{id}/results` - Get test results

### Health
- `GET /api/v1/health` - Health check

---

## 🗄️ Database Schema

### Tables (PostgreSQL)
- **users** - User accounts & authentication
- **projects** - Generated projects
- **generations** - Code generation records
- **sandboxes** - Sandbox environments
- **test_results** - Test execution results

### Cache (Redis)
- Session management
- Generation status cache
- Rate limiting counters
- WebSocket connection tracking

---

## 🔧 Technology Stack

### Backend
- FastAPI (Python 3.11)
- SQLAlchemy (async ORM)
- PostgreSQL
- Redis
- Docker SDK
- Cerebras AI API

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Zustand (state management)
- Monaco Editor
- Vite

### Infrastructure
- Docker & Docker Compose
- Nginx
- Vercel (deployment)
- WebSocket (real-time)

---

## 📝 Development Workflow

1. **Setup**: Run `./scripts/setup.sh`
2. **Start Services**: `docker-compose up -d`
3. **Frontend Dev**: `cd frontend && npm run dev`
4. **Backend Dev**: `cd backend && uvicorn main:app --reload`
5. **Access**: Frontend at `localhost:3000`, API at `localhost:8000`

---

**Last Updated**: 2024
**Version**: 1.0.0
