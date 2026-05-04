# 🗄️ Base de Datos - AI Social Coach

## Esquema Completo

### Tablas Principales

#### 1. User
Almacena información de usuarios y suscripciones.

```sql
- id: Identificador único
- email: Email único del usuario
- name: Nombre del usuario
- password: Hash de contraseña (bcrypt)
- avatar: URL de avatar (opcional)
- subscriptionTier: FREE | PRO | PREMIUM
- subscriptionStatus: ACTIVE | CANCELED | PAST_DUE | EXPIRED
- stripeCustomerId: ID de cliente en Stripe
- stripeSubscriptionId: ID de suscripción en Stripe
- conversationsThisMonth: Contador de conversaciones del mes
- lastResetDate: Fecha del último reset mensual
```

#### 2. Conversation
Registra cada sesión de conversación con la IA.

```sql
- id: Identificador único
- userId: Referencia al usuario
- scenario: CASUAL | DATE | PROFESSIONAL | FLIRTY | CHALLENGING
- aiPersonality: Tipo de personalidad de la IA
- difficulty: Nivel de dificultad (1-10)
- status: ACTIVE | COMPLETED | ABANDONED
- duration: Duración en segundos
- messageCount: Número de mensajes intercambiados
- startedAt: Timestamp de inicio
- endedAt: Timestamp de finalización
```

#### 3. Message
Almacena cada mensaje de la conversación.

```sql
- id: Identificador único
- conversationId: Referencia a la conversación
- role: USER | AI
- content: Texto del mensaje
- audioUrl: URL del archivo de audio (opcional)
- aiEmotion: Emoción de la IA (happy, neutral, annoyed, interested)
- aiInterest: Nivel de interés de la IA (1-10)
- timestamp: Momento del mensaje
```

#### 4. Analysis
Análisis detallado post-conversación.

```sql
- id: Identificador único
- conversationId: Referencia única a la conversación
- userId: Referencia al usuario
- overallScore: Puntuación general (1-10)
- confidence: Puntuación de confianza (1-10)
- charisma: Puntuación de carisma (1-10)
- humor: Puntuación de humor (1-10)
- empathy: Puntuación de empatía (1-10)
- attraction: Puntuación de atracción (1-10)
- strengths: Array de fortalezas detectadas
- weaknesses: Array de debilidades detectadas
- recommendations: Array de recomendaciones
- bestMoments: JSON con mejores momentos
- redFlags: JSON con señales de alerta
- aiSummary: Resumen general del análisis
- detailedFeedback: Feedback detallado
```

#### 5. UserStats
Estadísticas y progreso del usuario.

```sql
- id: Identificador único
- userId: Referencia única al usuario
- totalConversations: Total de conversaciones completadas
- totalMinutes: Total de minutos conversados
- averageScore: Puntuación promedio
- confidenceProgress: Progreso en confianza
- charismaProgress: Progreso en carisma
- humorProgress: Progreso en humor
- empathyProgress: Progreso en empatía
- currentStreak: Racha actual de días
- longestStreak: Racha más larga
- lastConversationDate: Fecha de última conversación
```

#### 6. Payment
Registro de pagos y facturación.

```sql
- id: Identificador único
- userId: Referencia al usuario
- stripePaymentId: ID de pago en Stripe
- amount: Monto en centavos
- currency: Moneda (usd)
- status: PENDING | SUCCEEDED | FAILED | REFUNDED
- plan: FREE | PRO | PREMIUM
- billingPeriod: MONTHLY | YEARLY
```

## Relaciones

```
User (1) ──→ (N) Conversation
User (1) ──→ (N) Analysis
User (1) ──→ (1) UserStats
User (1) ──→ (N) Payment
User (1) ──→ (N) Session

Conversation (1) ──→ (N) Message
Conversation (1) ──→ (1) Analysis
```

## Índices para Performance

```prisma
// User
@@index([email])
@@index([stripeCustomerId])

// Conversation
@@index([userId])
@@index([status])
@@index([startedAt])

// Message
@@index([conversationId])
@@index([timestamp])

// Analysis
@@index([userId])
@@index([overallScore])

// Payment
@@index([userId])
@@index([status])
```

## Queries Comunes Optimizadas

### 1. Obtener conversaciones recientes del usuario
```typescript
const recentConversations = await prisma.conversation.findMany({
  where: { userId },
  include: {
    analysis: true,
    _count: { select: { messages: true } }
  },
  orderBy: { startedAt: 'desc' },
  take: 10
})
```

### 2. Verificar límite de conversaciones
```typescript
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    subscriptionTier: true,
    conversationsThisMonth: true,
    lastResetDate: true
  }
})

// Resetear si es nuevo mes
const now = new Date()
const lastReset = new Date(user.lastResetDate)
if (now.getMonth() !== lastReset.getMonth()) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      conversationsThisMonth: 0,
      lastResetDate: now
    }
  })
}
```

### 3. Obtener análisis con conversación completa
```typescript
const analysis = await prisma.analysis.findUnique({
  where: { conversationId },
  include: {
    conversation: {
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      }
    }
  }
})
```

### 4. Actualizar estadísticas del usuario
```typescript
await prisma.userStats.upsert({
  where: { userId },
  create: {
    userId,
    totalConversations: 1,
    totalMinutes: duration,
    averageScore: score
  },
  update: {
    totalConversations: { increment: 1 },
    totalMinutes: { increment: duration },
    averageScore: (prevAvg * prevCount + score) / (prevCount + 1)
  }
})
```

## Migraciones

### Setup inicial
```bash
# Instalar Prisma
npm install prisma @prisma/client

# Inicializar Prisma
npx prisma init

# Crear migración inicial
npx prisma migrate dev --name init

# Generar cliente
npx prisma generate
```

### Comandos útiles
```bash
# Ver base de datos en navegador
npx prisma studio

# Crear nueva migración
npx prisma migrate dev --name add_new_field

# Aplicar migraciones en producción
npx prisma migrate deploy

# Reset completo (desarrollo)
npx prisma migrate reset
```

## Seed Data (Desarrollo)

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Usuario de prueba
  const hashedPassword = await hash('password123', 10)
  
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
      subscriptionTier: 'PRO'
    }
  })

  // Conversación de ejemplo
  const conversation = await prisma.conversation.create({
    data: {
      userId: user.id,
      scenario: 'CASUAL',
      status: 'COMPLETED',
      duration: 300,
      messageCount: 10,
      messages: {
        create: [
          {
            role: 'USER',
            content: 'Hola, ¿cómo estás?'
          },
          {
            role: 'AI',
            content: 'Hola! Bien, gracias. ¿Y tú?',
            aiEmotion: 'happy',
            aiInterest: 7
          }
        ]
      }
    }
  })

  console.log('Seed data created:', { user, conversation })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

## Backup y Mantenimiento

### Backup automático (Supabase)
- Backups diarios automáticos
- Retención de 7 días (plan gratuito)
- Point-in-time recovery (planes pagos)

### Limpieza de datos antiguos
```typescript
// Eliminar conversaciones abandonadas > 30 días
await prisma.conversation.deleteMany({
  where: {
    status: 'ABANDONED',
    startedAt: {
      lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    }
  }
})

// Eliminar archivos de audio huérfanos
// (implementar con cron job)
```

## Seguridad

- ✅ Passwords hasheados con bcrypt
- ✅ Índices en campos sensibles
- ✅ Cascade delete para integridad referencial
- ✅ Validación de datos con Zod antes de DB
- ✅ Row Level Security (RLS) en Supabase
- ✅ Conexiones SSL obligatorias

## Escalabilidad

- ✅ Connection pooling (Prisma)
- ✅ Índices optimizados
- ✅ Paginación en queries grandes
- ✅ Soft deletes para auditoría (futuro)
- ✅ Read replicas (producción)
