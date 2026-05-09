import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { hash } from 'bcrypt'
import { z } from 'zod'
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  password: z.string().min(8, 'Contraseña debe tener al menos 8 caracteres'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = registerSchema.parse(body)

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      )
    }

    // Hash de la contraseña
    const hashedPassword = await hash(data.password, 10)

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        subscriptionTier: 'FREE',
        subscriptionStatus: 'ACTIVE',
      },
      select: {
        id: true,
        email: true,
        name: true,
        subscriptionTier: true,
      },
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error: any) {
    console.error('Error registering user:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error al registrar usuario' },
      { status: 500 }
    )
  }
}
