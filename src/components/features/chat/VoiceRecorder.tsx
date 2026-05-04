'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Mic, Square } from 'lucide-react'

interface VoiceRecorderProps {
  onTranscription: (text: string) => void
  disabled?: boolean
}

export function VoiceRecorder({ onTranscription, disabled }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        await transcribeAudio(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('No se pudo acceder al micrófono')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsProcessing(true)

    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')

      const response = await fetch('/api/voice/transcribe', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        onTranscription(data.text)
      } else {
        console.error('Transcription error:', data.error)
      }
    } catch (error) {
      console.error('Error transcribing audio:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      {!isRecording ? (
        <Button
          onClick={startRecording}
          disabled={disabled || isProcessing}
          variant="primary"
          size="lg"
          className="rounded-full w-16 h-16 flex items-center justify-center"
        >
          <Mic className="w-6 h-6" />
        </Button>
      ) : (
        <Button
          onClick={stopRecording}
          variant="danger"
          size="lg"
          className="rounded-full w-16 h-16 flex items-center justify-center animate-pulse"
        >
          <Square className="w-6 h-6" />
        </Button>
      )}

      <div className="text-sm">
        {isRecording && <span className="text-red-600 font-medium">● Grabando...</span>}
        {isProcessing && <span className="text-purple-600">Procesando...</span>}
      </div>
    </div>
  )
}
