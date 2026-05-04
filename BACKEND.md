# ⚙️ Backend - AI Social Coach

## Servicios Implementados

### 1. OpenAI Service (`src/lib/services/openai.ts`)

Wrapper completo para la API de OpenAI con 4 funcionalidades principales:

#### Métodos:
- `generateResponse()`: Genera respuestas de IA con personalidad dinámica
- `transcribeAudio()`: Convierte audio a texto (Whisper)
- `synthesizeSpeech()`: Convierte texto a voz (TTS)
- `generateAnalysis()`: Analiza conversación completa y genera feedback

#### Características:
- Sistema de personalidades (friendly, flirty, challenging, shy, confident)
- Nivel de interés dinámico (1-10) que cambia según la conversación
- Detección de emociones (happy, interested, bored, annoyed)
- Análisis con 6 métricas: confidence, charisma, humor, empathy, attraction
- Prompts optimizados para comportamiento realista

### 2. Conversation Service (`src/lib/services/conversation.ts`)

Gestiona el ciclo completo de conversaciones.

#### Métodos:
- `startConversation()`: Inicia nueva conversación con verificación de límites
- `sendMessage()`: Procesa mensaje del usuario y genera respuesta IA
- `endConversation()`: Finaliza conversación y genera análisis
- `checkUserLimits()`: Verifica límites por plan de suscripción
- `updateUserStats()`: Actualiza estadísticas y rachas del usuario

#### Características:
- Verificación automática de límites por plan
- Reset mensual de contadores
- Contexto de últimos 20 mensajes
- Cálculo automático de duración
- Sistema de rachas (streaks)

### 3. Stripe Service (`src/lib/services/stripe.ts`)

Integración completa con Stripe para pagos y suscripciones.

#### Métodos:
- `createCheckoutSession()`: Crea sesión de pago
- `handleWebhook()`: Procesa eventos de Stripe
- `cancelSubscription()`: Cancela suscripción activa

#### Eventos Manejados:
- `checkout.session.completed`: Suscripción completada
- `customer.subscription.updated`: Suscripción actualizada
- `customer.subscription.deleted`: Suscripción cancelada
- `invoice.payment_succeeded`: Pago exitoso
- `invoice.payment_failed`: Pago fallido

## API Endpoints

### Autenticación

#### POST `/api/auth/register`
Registra nuevo usuario.

```typescript
// Request
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123"
}

// Response
{
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "John Doe",
    "subscriptionTier": "FREE"
  }
}
```

#### POST `/api/auth/[...nextauth]`
Login con NextAuth (credentials).

```typescript
// Request
{
  "email": "user@example.com",
  "password": "password123"
}

// Response (JWT token en cookie)
```

### Conversaciones

#### POST `/api/chat/start`
Inicia nueva conversación.

```typescript
// Request
{
  "scenario": "CASUAL" | "DATE" | "PROFESSIONAL" | "FLIRTY" | "CHALLENGING",
  "personality": "friendly" | "flirty" | "challenging" | "shy" | "confident",
  "difficulty": 5 // 1-10
}

// Response
{
  "conversation": {
    "id": "...",
    "scenario": "CASUAL",
    "status": "ACTIVE",
    "messages": [
      {
        "role": "AI",
        "content": "Hola! ¿Qué tal?",
        "aiEmotion": "neutral",
        "aiInterest": 5
      }
    ]
  }
}
```

#### POST `/api/chat/message`
Envía mensaje en conversación activa.

```typescript
// Request
{
  "conversationId": "...",
  "content": "Hola! Muy bien, ¿y tú?",
  "audioUrl": "https://..." // opcional
}

// Response
{
  "userMessage": { ... },
  "aiMessage": {
    "content": "Bien también! ¿Qué haces por aquí?",
    "aiEmotion": "interested",
    "aiInterest": 6
  }
}
```

#### POST `/api/chat/end`
Finaliza conversación y genera análisis.

```typescript
// Request
{
  "conversationId": "..."
}

// Response
{
  "analysis": {
    "overallScore": 7,
    "confidence": 8,
    "charisma": 6,
    "humor": 7,
    "empathy": 8,
    "attraction": 6,
    "strengths": ["Buena escucha activa", "Humor natural"],
    "weaknesses": ["Falta de polarización"],
    "recommendations": ["Sé más directo", "Crea más tensión"],
    "aiSummary": "Conversación sólida con buena base...",
    "detailedFeedback": "..."
  }
}
```

### Voz

#### POST `/api/voice/transcribe`
Transcribe audio a texto.

```typescript
// Request (FormData)
{
  "audio": File // archivo de audio
}

// Response
{
  "text": "Hola, ¿cómo estás?"
}
```

#### POST `/api/voice/synthesize`
Convierte texto a voz.

```typescript
// Request
{
  "text": "Hola! ¿Qué tal?",
  "voice": "nova" // alloy, echo, fable, onyx, nova, shimmer
}

// Response
// Audio MP3 (binary)
```

### Suscripciones

#### POST `/api/subscription/create`
Crea sesión de checkout de Stripe.

```typescript
// Request
{
  "plan": "PRO" | "PREMIUM",
  "billingPeriod": "MONTHLY" | "YEARLY"
}

// Response
{
  "url": "https://checkout.stripe.com/..."
}
```

#### POST `/api/subscription/webhook`
Webhook de Stripe (solo para Stripe).

```typescript
// Stripe envía eventos automáticamente
// Verifica firma y procesa eventos
```

## Límites por Plan

```typescript
const PLAN_LIMITS = {
  FREE: {
    conversationsPerMonth: 3,
    maxDuration: 5, // minutos
    features: ['Análisis básico']
  },
  PRO: {
    conversationsPerMonth: 30,
    maxDuration: 15,
    features: ['Análisis detallado', 'Todos los escenarios']
  },
  PREMIUM: {
    conversationsPerMonth: -1, // ilimitado
    maxDuration: 30,
    features: ['Todo PRO', 'Escenarios personalizados', 'Soporte prioritario']
  }
}
```

## Validación de Datos

Todos los endpoints usan Zod para validación:

```typescript
import { z } from 'zod'

const messageSchema = z.object({
  conversationId: z.string(),
  content: z.string().min(1),
  audioUrl: z.string().optional(),
})

// Uso
const data = messageSchema.parse(body)
```

## Manejo de Errores

```typescript
try {
  // Lógica
} catch (error: any) {
  console.error('Error:', error)
  
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: error.errors[0].message },
      { status: 400 }
    )
  }
  
  return NextResponse.json(
    { error: error.message || 'Error genérico' },
    { status: 500 }
  )
}
```

## Seguridad

### Autenticación
- JWT tokens con NextAuth
- Sesiones verificadas en cada endpoint
- Passwords hasheados con bcrypt (10 rounds)

### Rate Limiting
```typescript
// TODO: Implementar con Upstash Redis
// Límite: 100 requests/minuto por usuario
```

### Validación
- Zod schemas en todos los inputs
- Sanitización de datos
- Verificación de ownership (usuario solo accede a sus datos)

### CORS
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_APP_URL },
        ],
      },
    ]
  },
}
```

## Testing

### Unit Tests (Vitest)
```typescript
import { describe, it, expect, vi } from 'vitest'
import { conversationService } from './conversation'

describe('ConversationService', () => {
  it('should start conversation', async () => {
    const conversation = await conversationService.startConversation(
      'user-id',
      'CASUAL',
      'friendly',
      5
    )
    
    expect(conversation.status).toBe('ACTIVE')
    expect(conversation.scenario).toBe('CASUAL')
  })
})
```

### Integration Tests
```typescript
import { POST } from '@/app/api/chat/start/route'

describe('POST /api/chat/start', () => {
  it('should create conversation', async () => {
    const req = new Request('http://localhost:3000/api/chat/start', {
      method: 'POST',
      body: JSON.stringify({
        scenario: 'CASUAL',
        personality: 'friendly'
      })
    })
    
    const response = await POST(req)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.conversation).toBeDefined()
  })
})
```

## Deployment

### Variables de Entorno Requeridas
```bash
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="..."
OPENAI_API_KEY="sk-..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Vercel Deployment
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Configurar variables de entorno en Vercel Dashboard
```

### Database Migrations
```bash
# Producción
npx prisma migrate deploy

# Generar cliente
npx prisma generate
```

## Monitoreo

### Logs
- Console.error para errores
- Sentry para tracking de errores (TODO)
- LogRocket para sesiones de usuario (TODO)

### Métricas
- Response time promedio
- Error rate por endpoint
- Conversaciones por día
- Tasa de conversión (free → paid)

## Próximos Pasos

- [ ] Rate limiting con Upstash Redis
- [ ] Caching de análisis con Redis
- [ ] Queue system para análisis largos (BullMQ)
- [ ] Webhooks para notificaciones
- [ ] Admin dashboard
- [ ] Analytics avanzado
