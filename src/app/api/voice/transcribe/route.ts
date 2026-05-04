import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { openaiService } from '@/lib/services/openai'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const formData = await req.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return NextResponse.json({ error: 'No se proporcionó archivo de audio' }, { status: 400 })
    }

    const text = await openaiService.transcribeAudio(audioFile)

    return NextResponse.json({ text })
  } catch (error: any) {
    console.error('Error transcribing audio:', error)
    return NextResponse.json(
      { error: error.message || 'Error al transcribir audio' },
      { status: 500 }
    )
  }
}
