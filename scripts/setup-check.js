#!/usr/bin/env node

/**
 * Script de verificación de configuración
 * Verifica que todas las variables de entorno estén configuradas
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 Verificando configuración de AI Social Coach...\n')

// Leer .env.local
const envPath = path.join(process.cwd(), '.env.local')

if (!fs.existsSync(envPath)) {
  console.log('❌ Archivo .env.local no encontrado')
  console.log('   Ejecuta: cp .env.example .env.local\n')
  process.exit(1)
}

const envContent = fs.readFileSync(envPath, 'utf-8')
const envLines = envContent.split('\n')

const requiredVars = {
  DATABASE_URL: {
    required: true,
    description: 'URL de PostgreSQL (Supabase o local)',
    example: 'postgresql://user:pass@host:5432/db',
  },
  NEXTAUTH_SECRET: {
    required: true,
    description: 'Secret para NextAuth (generar con openssl)',
    example: 'openssl rand -base64 32',
  },
  OPENAI_API_KEY: {
    required: true,
    description: 'API Key de OpenAI',
    example: 'sk-proj-...',
  },
  STRIPE_SECRET_KEY: {
    required: false,
    description: 'Secret Key de Stripe (opcional)',
    example: 'sk_test_...',
  },
}

let allConfigured = true
let hasRequired = true

console.log('📋 Estado de Variables de Entorno:\n')

for (const [varName, config] of Object.entries(requiredVars)) {
  const line = envLines.find(l => l.startsWith(`${varName}=`))
  const value = line ? line.split('=')[1].replace(/"/g, '').trim() : null
  
  const isPlaceholder = value && (
    value.includes('...') ||
    value.includes('your-') ||
    value.includes('generate-') ||
    value === 'sk-' ||
    value.length < 10
  )
  
  const isConfigured = value && !isPlaceholder
  
  if (config.required) {
    if (isConfigured) {
      console.log(`✅ ${varName}`)
    } else {
      console.log(`❌ ${varName} (REQUERIDO)`)
      console.log(`   ${config.description}`)
      console.log(`   Ejemplo: ${config.example}\n`)
      hasRequired = false
      allConfigured = false
    }
  } else {
    if (isConfigured) {
      console.log(`✅ ${varName} (opcional)`)
    } else {
      console.log(`⚠️  ${varName} (opcional - no configurado)`)
      allConfigured = false
    }
  }
}

console.log('\n' + '='.repeat(50) + '\n')

if (!hasRequired) {
  console.log('❌ Faltan variables REQUERIDAS\n')
  console.log('📝 Pasos siguientes:')
  console.log('1. Edita .env.local con tus credenciales')
  console.log('2. Ejecuta este script nuevamente: node scripts/setup-check.js')
  console.log('3. Cuando todo esté ✅, ejecuta: npm run dev\n')
  console.log('📚 Ver SETUP.md para instrucciones detalladas\n')
  process.exit(1)
}

if (!allConfigured) {
  console.log('⚠️  Configuración mínima completa')
  console.log('   Variables opcionales no configuradas (Stripe)\n')
  console.log('✅ Puedes continuar con: npm run dev\n')
  console.log('💡 Tip: Configura Stripe después para probar pagos\n')
} else {
  console.log('✅ Todas las variables configuradas correctamente!\n')
  console.log('🚀 Próximos pasos:')
  console.log('1. npx prisma generate')
  console.log('2. npx prisma db push')
  console.log('3. npm run dev\n')
}

// Verificar node_modules
if (!fs.existsSync(path.join(process.cwd(), 'node_modules'))) {
  console.log('⚠️  node_modules no encontrado')
  console.log('   Ejecuta: npm install\n')
}

// Verificar Prisma client
const prismaClientPath = path.join(process.cwd(), 'node_modules', '.prisma', 'client')
if (!fs.existsSync(prismaClientPath)) {
  console.log('⚠️  Prisma client no generado')
  console.log('   Ejecuta: npx prisma generate\n')
}

console.log('📖 Documentación disponible:')
console.log('   - SETUP.md: Guía de configuración')
console.log('   - README.md: Información general')
console.log('   - STATUS.md: Estado del proyecto\n')
