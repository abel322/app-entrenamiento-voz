# 🚀 Guía de Deployment - AI Social Coach

## Pre-requisitos

### Cuentas Necesarias
- [ ] Vercel (hosting)
- [ ] Supabase o Railway (PostgreSQL)
- [ ] OpenAI (API key)
- [ ] Stripe (pagos)
- [ ] Dominio personalizado (opcional)

## Setup Paso a Paso

### 1. Clonar y Configurar Proyecto

```bash
# Clonar repositorio
git clone <repo-url>
cd ai-social-coach

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local
```

### 2. Configurar Base de Datos

#### Opción A: Supabase (Recomendado)

```bash
# 1. Crear proyecto en supabase.com
# 2. Copiar DATABASE_URL de Settings > Database
# 3. Agregar a .env.local

DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"

# 4. Ejecutar migraciones
npx prisma migrate deploy
npx prisma generate
```

#### Opción B: Railway

```bash
# 1. Crear proyecto en railway.app
# 2. Agregar PostgreSQL
# 3. Copiar DATABASE_URL
# 4. Ejecutar migraciones
```

### 3. Configurar OpenAI

```bash
# 1. Obtener API key de platform.openai.com
# 2. Agregar a .env.local

OPENAI_API_KEY="sk-..."
```

### 4. Configurar Stripe

```bash
# 1. Crear cuenta en stripe.com
# 2. Obtener keys de Developers > API keys
# 3. Agregar a .env.local

STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."

# 4. Crear productos y precios
# - Pro Monthly: $19
# - Pro Yearly: $190
# - Premium Monthly: $49
# - Premium Yearly: $490

# 5. Copiar Price IDs
STRIPE_PRO_MONTHLY_PRICE_ID="price_..."
STRIPE_PRO_YEARLY_PRICE_ID="price_..."
STRIPE_PREMIUM_MONTHLY_PRICE_ID="price_..."
STRIPE_PREMIUM_YEARLY_PRICE_ID="price_..."

# 6. Configurar webhook
# URL: https://yourdomain.com/api/subscription/webhook
# Eventos: checkout.session.completed, customer.subscription.*
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 5. Configurar NextAuth

```bash
# Generar secret
openssl rand -base64 32

# Agregar a .env.local
NEXTAUTH_SECRET="<generated-secret>"
NEXTAUTH_URL="http://localhost:3000"
```

### 6. Testing Local

```bash
# Iniciar servidor de desarrollo
npm run dev

# Abrir http://localhost:3000

# Verificar:
# - Registro de usuario funciona
# - Login funciona
# - Iniciar conversación funciona
# - Grabación de voz funciona
# - Análisis se genera correctamente
```

## Deployment a Vercel

### 1. Conectar Repositorio

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

### 2. Configurar Variables de Entorno

En Vercel Dashboard > Settings > Environment Variables:

```bash
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="..."

# OpenAI
OPENAI_API_KEY="sk-..."

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRO_MONTHLY_PRICE_ID="price_..."
STRIPE_PRO_YEARLY_PRICE_ID="price_..."
STRIPE_PREMIUM_MONTHLY_PRICE_ID="price_..."
STRIPE_PREMIUM_YEARLY_PRICE_ID="price_..."

# App
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### 3. Configurar Dominio

```bash
# En Vercel Dashboard > Settings > Domains
# Agregar dominio personalizado
# Configurar DNS según instrucciones
```

### 4. Deploy a Producción

```bash
vercel --prod
```

## Post-Deployment

### 1. Verificar Funcionalidad

- [ ] Registro de usuarios
- [ ] Login
- [ ] Iniciar conversación
- [ ] Grabación de voz
- [ ] Transcripción
- [ ] Respuesta de IA
- [ ] Síntesis de voz
- [ ] Finalizar conversación
- [ ] Ver análisis
- [ ] Checkout de Stripe
- [ ] Webhook de Stripe

### 2. Configurar Stripe Webhook en Producción

```bash
# 1. Ir a Stripe Dashboard > Developers > Webhooks
# 2. Agregar endpoint: https://yourdomain.com/api/subscription/webhook
# 3. Seleccionar eventos:
#    - checkout.session.completed
#    - customer.subscription.created
#    - customer.subscription.updated
#    - customer.subscription.deleted
#    - invoice.payment_succeeded
#    - invoice.payment_failed
# 4. Copiar signing secret
# 5. Actualizar STRIPE_WEBHOOK_SECRET en Vercel
```

### 3. Monitoreo

#### Vercel Analytics
```bash
# Habilitar en Vercel Dashboard > Analytics
# Monitorear:
# - Page views
# - Unique visitors
# - Top pages
# - Performance metrics
```

#### Sentry (Opcional)
```bash
npm install @sentry/nextjs

# Configurar en sentry.io
# Agregar SENTRY_DSN a variables de entorno
```

### 4. SEO

```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  title: 'AI Social Coach - Mejora tus habilidades sociales',
  description: 'Practica conversaciones con IA realista y recibe análisis detallado',
  keywords: ['social skills', 'dating coach', 'conversation practice', 'AI coach'],
  openGraph: {
    title: 'AI Social Coach',
    description: 'Mejora tus habilidades sociales con IA',
    url: 'https://yourdomain.com',
    siteName: 'AI Social Coach',
    images: [
      {
        url: 'https://yourdomain.com/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Social Coach',
    description: 'Mejora tus habilidades sociales con IA',
    images: ['https://yourdomain.com/og-image.jpg'],
  },
}
```

### 5. Sitemap y Robots.txt

```typescript
// src/app/sitemap.ts
export default function sitemap() {
  return [
    {
      url: 'https://yourdomain.com',
      lastModified: new Date(),
    },
    {
      url: 'https://yourdomain.com/login',
      lastModified: new Date(),
    },
    {
      url: 'https://yourdomain.com/register',
      lastModified: new Date(),
    },
    {
      url: 'https://yourdomain.com/pricing',
      lastModified: new Date(),
    },
  ]
}

// src/app/robots.ts
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/chat/', '/results/'],
    },
    sitemap: 'https://yourdomain.com/sitemap.xml',
  }
}
```

## Mantenimiento

### Backups

```bash
# Supabase: Backups automáticos diarios
# Verificar en Dashboard > Database > Backups

# Manual backup
pg_dump $DATABASE_URL > backup.sql
```

### Actualizaciones

```bash
# Actualizar dependencias
npm update

# Verificar vulnerabilidades
npm audit

# Actualizar Prisma
npm install @prisma/client@latest prisma@latest
npx prisma generate
```

### Logs

```bash
# Ver logs en Vercel
vercel logs

# Ver logs en tiempo real
vercel logs --follow
```

## Costos Estimados

### Desarrollo (Gratis)
- Vercel: Hobby plan (gratis)
- Supabase: Free tier (gratis)
- Stripe: Sin costo hasta ventas
- OpenAI: Pay-as-you-go

### Producción (Estimado mensual)

**Infraestructura:**
- Vercel Pro: $20/mes (opcional)
- Supabase Pro: $25/mes (recomendado)
- Dominio: $12/año

**APIs (variable según uso):**
- OpenAI GPT-4: ~$0.03 por conversación
- OpenAI Whisper: ~$0.006 por minuto
- OpenAI TTS: ~$0.015 por conversación
- Total por conversación: ~$0.05

**Stripe:**
- 2.9% + $0.30 por transacción

**Ejemplo con 100 usuarios activos:**
- 100 usuarios × 10 conversaciones/mes = 1,000 conversaciones
- OpenAI: 1,000 × $0.05 = $50
- Infraestructura: $45
- Total: ~$95/mes

**Revenue con 100 usuarios:**
- 70 Free: $0
- 20 Pro ($19): $380
- 10 Premium ($49): $490
- Total: $870/mes
- Profit: ~$775/mes

## Troubleshooting

### Error: Database connection failed
```bash
# Verificar DATABASE_URL
# Verificar que IP de Vercel esté en whitelist (Supabase)
# Verificar que database existe
npx prisma db push
```

### Error: OpenAI API rate limit
```bash
# Implementar rate limiting
# Considerar tier más alto de OpenAI
# Agregar queue system
```

### Error: Stripe webhook failed
```bash
# Verificar STRIPE_WEBHOOK_SECRET
# Verificar que endpoint esté accesible
# Verificar eventos seleccionados
# Ver logs en Stripe Dashboard
```

### Error: Audio recording not working
```bash
# Verificar HTTPS (requerido para getUserMedia)
# Verificar permisos de micrófono
# Verificar formato de audio soportado
```

## Checklist Final

- [ ] Base de datos configurada y migrada
- [ ] Variables de entorno configuradas
- [ ] OpenAI API funcionando
- [ ] Stripe configurado y testeado
- [ ] Webhook de Stripe funcionando
- [ ] Dominio personalizado configurado
- [ ] SSL/HTTPS habilitado
- [ ] SEO configurado
- [ ] Analytics habilitado
- [ ] Monitoreo de errores configurado
- [ ] Backups automáticos habilitados
- [ ] Documentación actualizada

## Soporte

- Vercel: https://vercel.com/support
- Supabase: https://supabase.com/support
- OpenAI: https://help.openai.com
- Stripe: https://support.stripe.com
