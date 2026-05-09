import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';

const synthesizeSchema = z.object({
  text: z.string().min(1),
  voice: z.enum(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { openaiService } = await import('@/lib/services/openai')
    const body = await req.json()
    const data = synthesizeSchema.parse(body)

    const audioBuffer = await openaiService.synthesizeSpeech(data.text, data.voice)

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
      },
    })
  } catch (error: any) {
    console.error('Error synthesizing speech:', error)
    return NextResponse.json(
      { error: error.message || 'Error al sintetizar voz' },
      { status: 500 }
    )
  }
}
