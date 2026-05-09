import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';

const endSchema = z.object({
  conversationId: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { conversationService } = await import('@/lib/services/conversation')
    const body = await req.json()
    const data = endSchema.parse(body)

    const analysis = await conversationService.endConversation(data.conversationId)

    return NextResponse.json({ analysis })
  } catch (error: any) {
    console.error('Error ending conversation:', error)
    return NextResponse.json(
      { error: error.message || 'Error al finalizar conversación' },
      { status: 400 }
    )
  }
}
