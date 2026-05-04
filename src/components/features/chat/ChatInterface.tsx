'use client'

import { useState, useRef, useEffect } from 'react'
import { VoiceRecorder } from './VoiceRecorder'
import { MessageBubble } from './MessageBubble'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'ai'
  content: string
  aiEmotion?: string
  aiInterest?: number
  timestamp: Date
}

interface ChatInterfaceProps {
  conversationId: string
  onEnd: () => void
}

export function ChatInterface({ conversationId, onEnd }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [aiInterest, setAiInterest] = useState(5)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    setIsLoading(true)

    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setInputText('')

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          content,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const aiMessage: Message = {
          id: data.aiMessage.id,
          role: 'ai',
          content: data.aiMessage.content,
          aiEmotion: data.aiEmotion,
          aiInterest: data.aiInterest,
          timestamp: new Date(data.aiMessage.timestamp),
        }
        setMessages(prev => [...prev, aiMessage])
        setAiInterest(data.aiInterest)

        // Sintetizar voz de la IA
        await playAiVoice(data.aiMessage.content)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const playAiVoice = async (text: string) => {
    try {
      const response = await fetch('/api/voice/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'nova' }),
      })

      if (response.ok) {
        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)
        audio.play()
      }
    } catch (error) {
      console.error('Error playing voice:', error)
    }
  }

  const handleTranscription = (text: string) => {
    sendMessage(text)
  }

  const handleEndConversation = async () => {
    if (confirm('¿Terminar conversación y ver análisis?')) {
      onEnd()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header con nivel de interés */}
      <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Conversación Activa</h3>
            <p className="text-sm text-gray-600">
              Nivel de interés: {aiInterest}/10
            </p>
          </div>
          <Button onClick={handleEndConversation} variant="secondary" size="sm">
            Terminar
          </Button>
        </div>
        
        {/* Barra de interés */}
        <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${aiInterest * 10}%` }}
          />
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-500">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-center gap-3">
          <VoiceRecorder
            onTranscription={handleTranscription}
            disabled={isLoading}
          />
          
          <div className="flex-1 flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputText)}
              placeholder="Escribe tu mensaje..."
              disabled={isLoading}
            />
            <Button
              onClick={() => sendMessage(inputText)}
              disabled={isLoading || !inputText.trim()}
              className="px-4"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
