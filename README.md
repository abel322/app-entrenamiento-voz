# 🚀 AI Social Coach

Una aplicación SaaS completa donde los usuarios pueden practicar habilidades sociales conversando con una IA realista que simula interacciones humanas reales.

## ✨ Características

- 🎭 **IA Realista**: Conversaciones con personalidad dinámica que reacciona emocionalmente
- 🎤 **Voz Integrada**: Habla por voz y escucha respuestas de la IA
- 📊 **Análisis Detallado**: Recibe feedback en 6 métricas (confianza, carisma, humor, empatía, atracción)
- 🎯 **Múltiples Escenarios**: Casual, citas, networking, coqueteo, desafiante
- 📈 **Progreso Trackeable**: Estadísticas, rachas y evolución
- 💳 **Monetización**: Sistema de suscripciones con Stripe

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animaciones)

### Backend
- **Next.js API Routes**
- **Prisma** (ORM)
- **PostgreSQL** (Supabase)
- **NextAuth.js** (autenticación)

### IA y Voz
- **OpenAI GPT-4** (conversaciones)
- **OpenAI Whisper** (speech-to-text)
- **OpenAI TTS** (text-to-speech)

### Pagos
- **Stripe** (suscripciones y pagos)

### Hosting
- **Vercel** (frontend y API)
- **Supabase** (base de datos)

## 📁 Estructura del Proyecto

```
ai-social-coach/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Páginas de autenticación
│   │   ├── (dashboard)/       # Páginas del dashboard
│   │   └── api/               # API Routes
│   ├── components/
│   │   ├── ui/                # Componentes base
│   │   └── features/          # Componentes de features
│   ├── lib/
│   │   ├── services/          # Servicios (OpenAI, Stripe, etc)
│   │   ├── prompts/           # Sistema de prompts de IA
│   │   └── utils/             # Utilidades
│   └── styles/                # Estilos globales
├── prisma/
│   └── schema.prisma          # Esquema de base de datos
├── ARCHITECTURE.md            # Documentación de arquitectura
├── DATABASE.md                # Documentación de base de datos
├── BACKEND.md                 # Documentación de backend
├── FRONTEND.md                # Documentación de frontend
├── PROMPTS.md                 # Documentación de prompts
└── DEPLOYMENT.md              # Guía de deployment
```

## 🚀 Quick Start

### 1. Clonar e Instalar

```bash
git clone <repo-url>
cd ai-social-coach
npm install
```

### 2. Configurar Variables de Entorno

```bash
cp .env.example .env.local
```

Editar `.env.local` con tus credenciales:

```bash
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"

# OpenAI
OPENAI_API_KEY="sk-..."

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 3. Configurar Base de Datos

```bash
# Ejecutar migraciones
npx prisma migrate dev

# Generar cliente Prisma
npx prisma generate

# (Opcional) Seed data
npx prisma db seed
```

### 4. Iniciar Desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## 📚 Documentación

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitectura del sistema
- [DATABASE.md](./DATABASE.md) - Esquema y queries de base de datos
- [BACKEND.md](./BACKEND.md) - APIs y servicios backend
- [FRONTEND.md](./FRONTEND.md) - Componentes y páginas frontend
- [PROMPTS.md](./PROMPTS.md) - Sistema de prompts de IA
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guía de deployment

## 🎯 Funcionalidades Principales

### 1. Sistema de Conversaciones

- Múltiples personalidades de IA (friendly, flirty, challenging, shy, confident)
- Nivel de interés dinámico que cambia según la conversación
- Detección de emociones (happy, interested, bored, annoyed)
- Respuestas realistas (no perfectas)

### 2. Análisis de Conversaciones

Métricas evaluadas (1-10):
- **Confidence**: Seguridad y ausencia de necesidad
- **Charisma**: Interés y energía generada
- **Humor**: Uso apropiado y natural de humor
- **Empathy**: Escucha activa y conexión emocional
- **Attraction**: Tensión sexual y polarización

### 3. Sistema de Voz

- Grabación de audio con MediaRecorder API
- Transcripción con OpenAI Whisper
- Síntesis de voz con OpenAI TTS
- Voces personalizadas por personalidad

### 4. Monetización

**Free Plan**
- 3 conversaciones/mes
- Máximo 5 minutos
- Análisis básico

**Pro Plan ($19/mes)**
- 30 conversaciones/mes
- Máximo 15 minutos
- Análisis detallado
- Todos los escenarios

**Premium Plan ($49/mes)**
- Conversaciones ilimitadas
- Máximo 30 minutos
- Análisis comprehensivo
- Escenarios personalizados

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📦 Build

```bash
# Build para producción
npm run build

# Iniciar servidor de producción
npm start
```

## 🚀 Deployment

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para guía completa.

### Deploy Rápido a Vercel

```bash
npm i -g vercel
vercel login
vercel --prod
```

## 🔒 Seguridad

- Passwords hasheados con bcrypt
- JWT tokens con NextAuth
- Validación de inputs con Zod
- Rate limiting (TODO)
- CORS configurado
- HTTPS obligatorio en producción

## 📈 Roadmap

### Fase 1 (Actual)
- [x] Arquitectura base
- [x] Sistema de conversaciones
- [x] Análisis de conversaciones
- [x] Sistema de voz
- [x] Monetización con Stripe

### Fase 2 (Próximo)
- [ ] Dark mode
- [ ] Historial de conversaciones
- [ ] Compartir resultados
- [ ] Notificaciones push
- [ ] PWA (Progressive Web App)

### Fase 3 (Futuro)
- [ ] App móvil (React Native)
- [ ] Escenarios personalizados
- [ ] Modo coach en tiempo real
- [ ] Análisis de lenguaje corporal (video)
- [ ] Comunidad y leaderboards

## 🤝 Contribuir

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto es privado y propietario.

## 👨‍💻 Autor

Creado con ❤️ usando el sistema Prompt Maestro

## 📞 Soporte

- Email: support@aisocialcoach.com
- Discord: [Unirse al servidor](https://discord.gg/...)
- Documentación: [docs.aisocialcoach.com](https://docs.aisocialcoach.com)

## 🙏 Agradecimientos

- OpenAI por GPT-4, Whisper y TTS
- Vercel por el hosting
- Stripe por el sistema de pagos
- La comunidad de Next.js

---

**¿Listo para mejorar tus habilidades sociales?** 🚀

[Comenzar Gratis](https://aisocialcoach.com/register)
