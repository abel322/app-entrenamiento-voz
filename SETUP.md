# 🚀 Setup Rápido - AI Social Coach

## ✅ Estado Actual

- [x] Dependencias instaladas
- [x] Archivo .env.local creado
- [ ] Variables de entorno configuradas
- [ ] Base de datos configurada
- [ ] Servidor iniciado

## 📝 Próximos Pasos

### 1. Configurar Variables de Entorno

Edita el archivo `.env.local` con tus credenciales:

#### A. Base de Datos (Requerido)

**Opción 1: Supabase (Recomendado - Gratis)**
1. Ir a [supabase.com](https://supabase.com)
2. Crear nuevo proyecto
3. Ir a Settings > Database
4. Copiar "Connection string" (URI)
5. Reemplazar en `.env.local`:
```bash
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
```

**Opción 2: PostgreSQL Local**
```bash
# Instalar PostgreSQL
# Crear base de datos: createdb ai_social_coach
DATABASE_URL="postgresql://postgres:password@localhost:5432/ai_social_coach"
```

#### B. NextAuth Secret (Requerido)

Generar secret:
```bash
# En Git Bash o WSL
openssl rand -base64 32

# O usar este comando en PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Copiar el resultado en `.env.local`:
```bash
NEXTAUTH_SECRET="<tu-secret-generado>"
```

#### C. OpenAI API (Requerido para IA)

1. Ir a [platform.openai.com](https://platform.openai.com)
2. Crear cuenta / Login
3. Ir a API Keys
4. Crear nueva key
5. Copiar en `.env.local`:
```bash
OPENAI_API_KEY="sk-proj-..."
```

**Nota:** Necesitarás agregar créditos ($5-10 para empezar)

#### D. Stripe (Opcional - Solo para pagos)

1. Ir a [stripe.com](https://stripe.com)
2. Crear cuenta
3. Ir a Developers > API keys
4. Copiar keys de test:
```bash
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

**Para webhooks (después de deploy):**
```bash
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 2. Configurar Base de Datos

Una vez configurado `DATABASE_URL`:

```bash
# Generar cliente Prisma
npx prisma generate

# Crear tablas en la base de datos
npx prisma db push

# (Opcional) Ver base de datos en navegador
npx prisma studio
```

### 3. Iniciar Servidor

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## 🎯 Verificación Rápida

### Sin OpenAI (Solo UI)
Si no tienes OpenAI configurado, puedes ver la UI:
- ✅ Landing page
- ✅ Login/Register (UI)
- ✅ Dashboard (UI)
- ❌ Chat (necesita OpenAI)

### Con OpenAI
- ✅ Todo funcional
- ✅ Conversaciones con IA
- ✅ Análisis completo

## 🐛 Troubleshooting

### Error: "Can't reach database server"
```bash
# Verificar que DATABASE_URL esté correcto
# Verificar que la base de datos esté corriendo
# Si usas Supabase, verificar que el proyecto esté activo
```

### Error: "Invalid API key" (OpenAI)
```bash
# Verificar que OPENAI_API_KEY esté correcto
# Verificar que tengas créditos en OpenAI
# Verificar que la key no tenga espacios
```

### Error: "Module not found"
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error de TypeScript
```bash
# Regenerar tipos de Prisma
npx prisma generate
```

## 📦 Configuración Mínima para Desarrollo

Para empezar a desarrollar solo necesitas:

1. **DATABASE_URL** (Supabase gratis)
2. **NEXTAUTH_SECRET** (generar con comando)
3. **OPENAI_API_KEY** (si quieres probar IA)

Las demás variables son opcionales para desarrollo.

## 🚀 Siguiente: Desarrollo

Una vez todo configurado:

1. Crear usuario en `/register`
2. Login en `/login`
3. Ir a `/dashboard`
4. Iniciar conversación
5. Probar funcionalidades

## 📚 Documentación Completa

- [README.md](./README.md) - Información general
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitectura
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deploy a producción

## 💡 Tips

- Usa Supabase para base de datos (gratis y fácil)
- OpenAI tiene $5 de crédito gratis para nuevas cuentas
- Stripe tiene modo test (no necesitas tarjeta real)
- Vercel es gratis para hosting

## ❓ Ayuda

Si tienes problemas:
1. Revisa los logs en la terminal
2. Verifica que todas las variables estén configuradas
3. Asegúrate de que la base de datos esté accesible
4. Revisa la documentación de cada servicio

---

**¿Todo listo?** Ejecuta `npm run dev` y comienza a desarrollar! 🎉
