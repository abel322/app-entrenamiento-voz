# 💻 Frontend - AI Social Coach

## Estructura Implementada

### Componentes UI Base (`src/components/ui/`)

#### Button
Botón con variantes y estados de carga.
```typescript
<Button variant="primary" size="lg" isLoading={false}>
  Click me
</Button>
```

Variantes: `primary`, `secondary`, `ghost`, `danger`
Tamaños: `sm`, `md`, `lg`

#### Input
Input con label y manejo de errores.
```typescript
<Input
  label="Email"
  type="email"
  error="Email inválido"
/>
```

#### Card
Contenedor con efectos de gradiente y hover.
```typescript
<Card gradient hover>
  Content
</Card>
```

### Componentes de Features

#### Auth
- `LoginForm`: Formulario de login con NextAuth
- `RegisterForm`: Registro de nuevos usuarios

#### Chat
- `VoiceRecorder`: Grabación de audio con MediaRecorder API
- `ChatInterface`: Interfaz completa de chat con IA
- `MessageBubble`: Burbujas de mensajes con emociones

#### Dashboard
- `StatsCard`: Tarjetas de estadísticas con iconos

#### Results
- `AnalysisCard`: Visualización completa del análisis

## Páginas

### Landing (`/`)
- Hero section con gradientes
- Features grid
- CTA para registro

### Auth
- `/login`: Login con NextAuth
- `/register`: Registro de usuarios

### Dashboard (`/dashboard`)
- Estadísticas del usuario
- Grid de escenarios disponibles
- CTA para upgrade

### Chat (`/chat?id=xxx`)
- Interfaz de conversación en tiempo real
- Grabación de voz
- Barra de nivel de interés
- Síntesis de voz automática

### Results (`/results?id=xxx`)
- Puntuación general
- Métricas detalladas (6 categorías)
- Fortalezas y debilidades
- Recomendaciones

## Estilos y Diseño

### Paleta de Colores
```css
/* Gradientes principales */
from-purple-600 to-pink-600  /* Primary gradient */
from-purple-50 via-pink-50 to-blue-50  /* Background gradient */

/* Colores sólidos */
purple-600, pink-600  /* Accent colors */
gray-100, gray-600, gray-900  /* Neutrals */
```

### Animaciones
```css
/* Hover effects */
hover:scale-105
hover:shadow-xl
hover:-translate-y-1

/* Loading states */
animate-spin
animate-bounce
animate-pulse

/* Transitions */
transition-all duration-200
transition-colors
```

### Responsive Design
```typescript
// Mobile first
className="
  w-full           // mobile
  md:w-1/2         // tablet (768px+)
  lg:w-1/3         // desktop (1024px+)
"
```

## Hooks Personalizados

### useChat (TODO)
```typescript
const { messages, sendMessage, isLoading } = useChat(conversationId)
```

### useVoice (TODO)
```typescript
const { startRecording, stopRecording, isRecording } = useVoice()
```

### useAuth (TODO)
```typescript
const { user, isLoading, logout } = useAuth()
```

## Gestión de Estado

### Zustand Store (TODO)
```typescript
// stores/useUserStore.ts
interface UserStore {
  user: User | null
  setUser: (user: User) => void
  logout: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}))
```

## API Client

### Fetch Wrapper
```typescript
// lib/api/client.ts
export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message)
  }

  return response.json()
}
```

## Optimizaciones

### Code Splitting
```typescript
import dynamic from 'next/dynamic'

const ChatInterface = dynamic(() => import('./ChatInterface'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
})
```

### Image Optimization
```typescript
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority
/>
```

### Font Optimization
```typescript
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
```

## Accesibilidad

### Implementado
- ✅ Semantic HTML (button, input, form)
- ✅ Labels en inputs
- ✅ Focus visible
- ✅ Keyboard navigation (Enter para enviar)
- ✅ Loading states descriptivos
- ✅ Error messages claros

### TODO
- [ ] ARIA labels en componentes complejos
- [ ] Screen reader testing
- [ ] Color contrast validation (WCAG AA)
- [ ] Skip to content link

## Testing

### Unit Tests (Vitest)
```typescript
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(<Button isLoading>Click me</Button>)
    expect(screen.getByText('Cargando...')).toBeInTheDocument()
  })
})
```

### E2E Tests (Playwright)
```typescript
test('user can start conversation', async ({ page }) => {
  await page.goto('/dashboard')
  await page.click('text=Casual')
  await expect(page).toHaveURL(/\/chat/)
})
```

## Performance

### Métricas Objetivo
- First Contentful Paint: < 1.8s
- Time to Interactive: < 3.8s
- Cumulative Layout Shift: < 0.1
- Lighthouse Score: > 90

### Optimizaciones Aplicadas
- ✅ Next.js App Router (Server Components)
- ✅ Tailwind CSS (purge unused)
- ✅ Font optimization
- ✅ Lazy loading de componentes pesados
- ✅ Debounce en inputs

## Deployment

### Build
```bash
npm run build
```

### Environment Variables
```bash
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### Vercel
```bash
vercel --prod
```

## Próximos Pasos

### Funcionalidades
- [ ] Dark mode
- [ ] Notificaciones push
- [ ] Compartir resultados
- [ ] Historial de conversaciones
- [ ] Filtros y búsqueda
- [ ] Perfil de usuario editable

### Mejoras UI/UX
- [ ] Animaciones con Framer Motion
- [ ] Skeleton loaders
- [ ] Toast notifications
- [ ] Modal confirmations
- [ ] Drag and drop (futuro)

### Performance
- [ ] Service Worker (PWA)
- [ ] Offline mode
- [ ] Prefetching de rutas
- [ ] Image lazy loading
- [ ] Virtual scrolling (listas largas)

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Lint
npm run lint

# Type check
npx tsc --noEmit
```

## Estructura de Archivos Final

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx
│   │   ├── chat/page.tsx
│   │   └── results/page.tsx
│   ├── api/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── card.tsx
│   └── features/
│       ├── auth/
│       ├── chat/
│       ├── dashboard/
│       └── results/
├── lib/
│   ├── utils/
│   │   └── cn.ts
│   └── api/
└── styles/
    └── globals.css
```
