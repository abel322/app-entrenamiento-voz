'use client'

import { cn } from '@/lib/utils/cn'

interface Message {
  role: 'user' | 'ai'
  content: string
  aiEmotion?: string
  aiInterest?: number
  timestamp: Date
}

interface MessageBubbleProps {
  message: Message
}

const emotionEmojis: Record<string, string> = {
  happy: '😊',
  interested: '😏',
  neutral: '😐',
  bored: '😑',
  annoyed: '😒',
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[70%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
            : 'bg-gray-100 text-gray-900'
        )}
      >
        <p className="text-sm md:text-base">{message.content}</p>
        
        {!isUser && message.aiEmotion && (
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
            <span>{emotionEmojis[message.aiEmotion] || '😐'}</span>
            <span className="opacity-70">
              {message.aiEmotion}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
