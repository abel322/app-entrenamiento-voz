# 🏗️ AI Social Coach - Arquitectura del Sistema

## Stack Tecnológico

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Componentes**: shadcn/ui
- **Estado**: Zustand
- **Formularios**: React Hook Form + Zod
- **Animaciones**: Framer Motion

### Backend
- **Runtime**: Next.js API Routes
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma
- **Autenticación**: NextAuth.js
- **IA**: OpenAI API (GPT-4)
- **Voz**: OpenAI Whisper (STT) + TTS

### Infraestructura
- **Hosting**: Vercel
- **Base de Datos**: Supabase / Railway
- **Storage**: Vercel Blob (audio files)
- **Pagos**: Stripe

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Auth    │  │Dashboard │  │   Chat   │  │ Results  │   │
│  │  Pages   │  │   Page   │  │   Page   │  │   Page   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ API Calls
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (API Routes)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Auth   │  │   User   │  │   Chat   │  │ Analysis │   │
│  │   API    │  │   API    │  │   API    │  │   API    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    SERVICIOS EXTERNOS                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │PostgreSQL│  │ OpenAI   │  │  Stripe  │  │  Vercel  │   │
│  │(Supabase)│  │   API    │  │   API    │  │   Blob   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Estructura de Carpetas

```
ai-social-coach/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── chat/
│   │   │   │   └── page.tsx
│   │   │   ├── results/
│   │   │   │   └── page.tsx
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   ├── chat/
│   │   │   │   ├── start/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── message/
│   │   │   │   │   └── route.ts
│   │   │   │   └── end/
│   │   │   │       └── route.ts
│   │   │   ├── voice/
│   │   │   │   ├── transcribe/
│   │   │   │   │   └── route.ts
│   │   │   │   └── synthesize/
│   │   │   │       └── route.ts
│   │   │   ├── analysis/
│   │   │   │   └── route.ts
│   │   │   └── subscription/
│   │   │       ├── create/
│   │   │       │   └── route.ts
│   │   │       └── webhook/
│   │   │           └── route.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── modal.tsx
│   │   │   └── ...
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── RegisterForm.tsx
│   │   │   ├── chat/
│   │   │   │   ├── VoiceRecorder.tsx
│   │   │   │   ├── ChatInterface.tsx
│   │   │   │   └── MessageBubble.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── StatsCard.tsx
│   │   │   │   └── RecentSessions.tsx
│   │   │   └── results/
│   │   │       ├── AnalysisCard.tsx
│   │   │       └── ScoreChart.tsx
│   │   └── layouts/
│   │       ├── DashboardLayout.tsx
│   │       └── AuthLayout.tsx
│   ├── lib/
│   │   ├── api/
│   │   │   └── client.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useChat.ts
│   │   │   └── useVoice.ts
│   │   ├── services/
│   │   │   ├── openai.ts
│   │   │   ├── stripe.ts
│   │   │   └── storage.ts
│   │   ├── utils/
│   │   │   ├── cn.ts
│   │   │   └── validators.ts
│   │   ├── db/
│   │   │   └── prisma.ts
│   │   └── prompts/
│   │       ├── personality.ts
│   │       ├── analysis.ts
│   │       └── scenarios.ts
│   ├── types/
│   │   └── index.ts
│   └── styles/
│       └── globals.css
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   ├── images/
│   └── sounds/
├── .env.example
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Flujo de Datos

### 1. Autenticación
```
Usuario → Login Form → NextAuth API → PostgreSQL → JWT Token → Dashboard
```

### 2. Conversación con IA
```
Usuario habla → Micrófono → Audio Blob → 
Whisper API (STT) → Texto → 
OpenAI GPT-4 (Personality Prompt) → Respuesta IA → 
OpenAI TTS → Audio → Usuario escucha
```

### 3. Análisis Post-Conversación
```
Conversación completa → OpenAI GPT-4 (Analysis Prompt) → 
Análisis detallado → PostgreSQL → Vista de Resultados
```

### 4. Suscripción
```
Usuario → Pricing Page → Stripe Checkout → 
Webhook → PostgreSQL (actualizar plan) → Dashboard
```

## Modelos de Datos Principales

### User
- id, email, name, password
- subscriptionTier (free, pro, premium)
- subscriptionStatus
- creditsRemaining
- createdAt, updatedAt

### Conversation
- id, userId
- scenario (casual, date, professional)
- duration
- messageCount
- status (active, completed)
- createdAt, endedAt

### Message
- id, conversationId
- role (user, ai)
- content (texto)
- audioUrl (opcional)
- timestamp

### Analysis
- id, conversationId, userId
- overallScore (1-10)
- confidence, charisma, humor, empathy
- strengths, weaknesses
- recommendations
- createdAt

## Componentes Principales

### Frontend
1. **VoiceRecorder**: Captura audio del micrófono
2. **ChatInterface**: Muestra conversación en tiempo real
3. **AnalysisCard**: Visualiza resultados del análisis
4. **SubscriptionModal**: Gestiona upgrades de plan

### Backend
1. **OpenAI Service**: Wrapper para GPT-4, Whisper, TTS
2. **Auth Service**: Gestión de usuarios y sesiones
3. **Conversation Service**: Lógica de conversaciones
4. **Analysis Service**: Generación de análisis
5. **Subscription Service**: Integración con Stripe

## Seguridad

- [ ] JWT tokens con expiración
- [ ] Rate limiting en APIs
- [ ] Validación de inputs (Zod)
- [ ] CORS configurado
- [ ] Variables de entorno para secrets
- [ ] Sanitización de audio uploads
- [ ] HTTPS obligatorio

## Performance

- [ ] Server Components por defecto
- [ ] Streaming de respuestas IA
- [ ] Lazy loading de componentes pesados
- [ ] Optimización de imágenes (Next.js Image)
- [ ] Caching de análisis previos
- [ ] Connection pooling (Prisma)

## Escalabilidad

- [ ] Serverless functions (Vercel)
- [ ] Database indexing
- [ ] CDN para assets estáticos
- [ ] Queue system para análisis largos (futuro)
- [ ] Microservices para IA (futuro)

## Monetización

### Planes
- **Free**: 3 conversaciones/mes, análisis básico
- **Pro** ($19/mes): 30 conversaciones/mes, análisis detallado
- **Premium** ($49/mes): Ilimitado, escenarios personalizados

### Limitaciones por Plan
```typescript
const PLAN_LIMITS = {
  free: {
    conversationsPerMonth: 3,
    maxDuration: 5, // minutos
    analysisDetail: 'basic'
  },
  pro: {
    conversationsPerMonth: 30,
    maxDuration: 15,
    analysisDetail: 'detailed'
  },
  premium: {
    conversationsPerMonth: -1, // ilimitado
    maxDuration: 30,
    analysisDetail: 'comprehensive'
  }
}
```

## Próximos Pasos

1. ✅ Arquitectura definida
2. ⏳ Base de datos (Prisma schema)
3. ⏳ Backend APIs
4. ⏳ Frontend UI
5. ⏳ Integración IA
6. ⏳ Sistema de voz
7. ⏳ Monetización
