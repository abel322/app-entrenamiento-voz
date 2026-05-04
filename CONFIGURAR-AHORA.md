# 🔧 Configuración Pendiente

## ✅ Ya Configurado

- [x] NEXTAUTH_SECRET ✅ (Generado automáticamente)
- [x] NEXTAUTH_URL ✅
- [x] NEXT_PUBLIC_APP_URL ✅

## ❌ NECESITAS CONFIGURAR

### 1. DATABASE_URL (REQUERIDO) 🗄️

**Opción Recomendada: Supabase (Gratis)**

1. Ve a: https://supabase.com
2. Click en "Start your project"
3. Crear cuenta (con GitHub es más rápido)
4. Click en "New Project"
5. Completa:
   - Name: `ai-social-coach`
   - Database Password: (guarda esta contraseña)
   - Region: Elige el más cercano
   - Click "Create new project"
6. Espera 2-3 minutos mientras se crea
7. Ve a Settings (⚙️) > Database
8. Busca "Connection string" > URI
9. Copia la URL (se ve así):
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
   ```
10. Reemplaza `[YOUR-PASSWORD]` con tu contraseña
11. Pega en `.env.local` en la línea `DATABASE_URL=`

**Ejemplo:**
```bash
DATABASE_URL="postgresql://postgres.abcdefgh:MiPassword123@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

### 2. OPENAI_API_KEY (REQUERIDO) 🤖

**Para que funcione la IA**

1. Ve a: https://platform.openai.com
2. Crear cuenta / Login
3. Ve a: https://platform.openai.com/api-keys
4. Click en "Create new secret key"
5. Nombre: `ai-social-coach`
6. Click "Create secret key"
7. **COPIA LA KEY AHORA** (solo se muestra una vez)
8. Pega en `.env.local` en la línea `OPENAI_API_KEY=`

**Ejemplo:**
```bash
OPENAI_API_KEY="sk-proj-abcd1234efgh5678ijkl9012mnop3456qrst7890uvwx"
```

**💰 Costos:**
- Nuevas cuentas: $5 de crédito gratis
- Después: ~$0.05 por conversación
- Para desarrollo: $5-10 es suficiente

### 3. STRIPE (OPCIONAL - Solo para pagos) 💳

**Puedes configurar esto después**

Si quieres probar el sistema de pagos:

1. Ve a: https://stripe.com
2. Crear cuenta
3. Ve a: Developers > API keys
4. Copia las keys de TEST:
   - Publishable key: `pk_test_...`
   - Secret key: `sk_test_...`
5. Pega en `.env.local`

**Nota:** En modo test no necesitas tarjeta real.

## 📝 Archivo .env.local Completo

Así debería verse tu archivo después de configurar:

```bash
# Database (REEMPLAZA CON TU URL DE SUPABASE)
DATABASE_URL="postgresql://postgres.xxxxx:TuPassword@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# NextAuth (YA CONFIGURADO ✅)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="WaLM28OT1D9GqWKipATv6dXBcz3xsjPY9gO9L1FVHjw="

# OpenAI (REEMPLAZA CON TU KEY)
OPENAI_API_KEY="sk-proj-tu-key-aqui"

# Stripe (OPCIONAL - Puedes dejarlo así por ahora)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App Config (YA CONFIGURADO ✅)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## ✅ Después de Configurar

Una vez que hayas configurado DATABASE_URL y OPENAI_API_KEY:

```bash
# 1. Verificar que todo esté bien
node scripts/setup-check.js

# 2. Generar Prisma client
npx prisma generate

# 3. Crear tablas en la base de datos
npx prisma db push

# 4. Iniciar servidor
npm run dev
```

## 🆘 Ayuda Rápida

### "No tengo tarjeta de crédito para OpenAI"
- OpenAI requiere tarjeta para usar la API
- Alternativa: Usa una tarjeta virtual (Revolut, Wise)
- O pide a alguien que te preste una tarjeta temporalmente

### "Supabase no me deja crear proyecto"
- Verifica tu email
- Intenta con otro navegador
- Usa cuenta de GitHub para login

### "No encuentro la connection string en Supabase"
- Settings > Database
- Scroll hasta "Connection string"
- Selecciona "URI" (no "Session mode")
- Copia y reemplaza [YOUR-PASSWORD]

## 💡 Tips

1. **Guarda tus credenciales en un lugar seguro** (password manager)
2. **No compartas tu OPENAI_API_KEY** (cuesta dinero)
3. **Supabase es gratis** hasta 500MB de datos
4. **Stripe en modo test** no cobra nada

## 🚀 ¿Listo?

Cuando hayas configurado DATABASE_URL y OPENAI_API_KEY:

```bash
node scripts/setup-check.js
```

Si ves ✅ en ambos, continúa con los siguientes comandos!

---

**¿Necesitas ayuda?** Revisa SETUP.md para más detalles.
