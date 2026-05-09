import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';

const messageSchema = z.object({
  conversationId: z.string(),
  content: z.string().min(1),
  audioUrl: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { conversationService } = await import('@/lib/services/conversation')
    const body = await req.json()
    const data = messageSchema.parse(body)

    const result = await conversationService.sendMessage(
      data.conversationId,
      data.content,
      data.audioUrl
    )

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: error.message || 'Error al enviar mensaje' },
      { status: 400 }
    )
  }
}
