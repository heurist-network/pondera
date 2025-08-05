# Pondera - AI Chat Platform

Pondera is a Next.js-based AI chat platform that supports multiple AI models and document processing capabilities. It features a modern React frontend with a Python Flask backend for document processing.

## Project Structure

### Frontend (Next.js)
- **Framework**: Next.js 15 with React 18
- **State Management**: Zustand with persistence
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with custom styling
- **Icons**: Iconify collections (f7, ri, mingcute)

### Backend (Python Flask)
- **Framework**: Flask 3.0 with CORS support
- **Document Processing**: LangChain, PyMuPDF for PDF processing
- **Vector Storage**: Pinecone for document embeddings
- **File Storage**: AWS S3 integration
- **Deployment**: Docker with nginx-certbot for SSL

## Key Features

1. **Multi-Model AI Chat**
   - Support for various AI models (OpenAI GPT, Deepseek, Llama, Qwen, Yi, ASI)
   - Dynamic model icon assignment based on model name patterns
   - Temperature and max tokens configuration

2. **Document Processing & RAG**
   - PDF upload and processing via backend
   - Document chunking and vector embeddings
   - Context-aware responses using retrieved documents
   - S3 storage for uploaded files

3. **Chat Management**
   - Chat persistence with PostgreSQL (Neon)
   - Chat sharing functionality with unique URLs
   - Auto-generated chat titles
   - Chat history and state management

4. **UI/UX Features**
   - Responsive design with mobile and desktop layouts
   - Dark/light theme support (next-themes)
   - Real-time streaming responses
   - Copy/edit/share message actions
   - Pre-built prompt templates

## Environment Configuration

### Required Environment Variables

#### Frontend (.env.local)
```bash
# Heurist Gateway Integration
HEURIST_GATEWAY_URL=your_gateway_url
HEURIST_AUTH_KEY=your_auth_key

# Database
DATABASE_URL=your_postgres_url

# Redis (for rate limiting)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# Public
NEXT_PUBLIC_BACKEND_URL=your_backend_url
```

#### Backend (.env)
```bash
# Document processing and storage configuration
# (specific variables in backend/config.py)
```

## Development Scripts

### Frontend
```bash
# Development
pnpm dev              # Start development server (localhost:3000)
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Package manager: pnpm (required - version 9.10.0+)
```

### Backend
```bash
# Development
python run.py         # Start Flask dev server (localhost:5000)

# Production
docker-compose up     # Start with nginx reverse proxy
```

## Architecture Patterns

### State Management
- **Chat Store**: Zustand store with persistence (`src/store/chat/index.ts`)
  - Manages chat sessions, messages, and AI model state
  - Handles streaming responses and abort controllers
  - Persists chat history to localStorage

### API Integration
- **Chat API**: `/src/app/api/chat/route.ts`
  - Streams responses using `ai-stream-sdk`
  - Integrates document context when available
  - Handles model switching and parameter configuration

### Component Architecture
- **Module-based structure**: `/src/modules/`
  - `chatInput/`: Message input with file upload
  - `chatList/`: Message display and management
  - `chatModel/`: Model selection interface
  - `sideBar/`: Navigation and chat history

### Database Schema
- **PostgreSQL**: Uses Drizzle ORM
- **Share table**: Stores shareable chat sessions
- **Enums**: License and status enumerations

## Model Integration

### Adding New Models
When adding new AI models, update these files:
1. `src/app/share/[slug]/page.tsx` - Add icon detection logic
2. `src/store/chat/index.ts` - Add icon detection logic  
3. `public/model/` - Add model icon file

Example pattern:
```typescript
if (model.includes('model-name-pattern')) {
  icon = '/model/model-icon.svg'
}
```

### Current Model Support
- **OpenAI**: GPT models (uses `/model/openai.svg`)
- **Deepseek**: Deepseek models (uses `/model/deepseek.png`)
- **Meta**: Llama models (uses `/model/llama.jpeg`)
- **Qwen**: Qwen models (uses `/model/qwen.svg`)
- **Yi**: Yi models (uses `/model/yi.svg`)
- **ASI**: ASI models (uses `/model/asi.jpg`)

## Deployment

### Production Deployment
1. **Frontend**: Deploy Next.js app to Vercel or similar
2. **Backend**: Use Docker Compose with nginx-certbot
   - SSL certificates via Let's Encrypt + Cloudflare DNS
   - Health checks and auto-restart policies
   - Network isolation with bridge driver

### Docker Configuration
- **Backend container**: Python Flask app on port 5000
- **Nginx container**: Reverse proxy with SSL on ports 80/443
- **Volumes**: SSL certificates persistence
- **Networks**: Isolated app-network

## Key Dependencies

### Frontend
- **Streaming**: `@fortaine/fetch-event-source` for SSE
- **Database**: `@neondatabase/serverless`, `drizzle-orm`
- **Rate Limiting**: `@upstash/ratelimit`, `@upstash/redis`
- **UI**: `@radix-ui/*` components, `framer-motion`
- **Markdown**: `react-markdown`, `rehype-katex`, `remark-gfm`

### Backend
- **Web Framework**: `flask`, `flask-cors`
- **Document Processing**: `langchain`, `PyMuPDF`
- **Vector Search**: `pinecone-client`, `langchain-pinecone`  
- **Storage**: `boto3` (AWS S3)
- **Deployment**: `gunicorn`, `apscheduler`

## Development Guidelines

### Code Standards
- **TypeScript**: Strict typing throughout frontend
- **ESLint**: Next.js configuration with custom rules
- **Prettier**: Code formatting (custom config via `@innei/prettier`)
- **Component Patterns**: Modular architecture with clear separation

### Performance Considerations
- **Edge Runtime**: Chat API uses Edge Runtime for better performance
- **Streaming**: Real-time response streaming for better UX
- **Virtualization**: Large chat lists use `react-virtuoso`
- **Code Splitting**: Next.js automatic code splitting

### Security
- **Environment Validation**: `@t3-oss/env-nextjs` for env var validation
- **Rate Limiting**: Upstash Redis-based rate limiting
- **CORS**: Configured for backend API access
- **SSL**: Automatic certificate management in production

## Testing & Quality

### Linting & Formatting
```bash
# Run linting
pnpm lint

# Format code (automatic via Prettier)
```

### Type Checking
- TypeScript strict mode enabled
- Zod for runtime type validation
- Drizzle ORM for type-safe database queries

## Contributing

When making changes:
1. Follow existing code patterns and architecture
2. Update model icon mappings when adding new AI models
3. Ensure environment variables are properly configured
4. Test both frontend and backend integration
5. Run linting before committing changes