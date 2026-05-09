import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';

const startSchema = z.object({
  scenario: z.enum(['CASUAL', 'DATE', 'PROFESSIONAL', 'FLIRTY', 'CHALLENGING']),
  personality: z.string().optional().default('friendly'),
  difficulty: z.number().min(1).max(10).optional().default(5),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { conversationService } = await import('@/lib/services/conversation')
    const body = await req.json()
    const data = startSchema.parse(body)

    const conversation = await conversationService.startConversation(
      session.user.email, // Usar email como userId temporalmente
      data.scenario,
      data.personality,
      data.difficulty
    )

    return NextResponse.json({ conversation })
  } catch (error: any) {
    console.error('Error starting conversation:', error)
    return NextResponse.json(
      { error: error.message || 'Error al iniciar conversación' },
      { status: 400 }
    )
  }
}
