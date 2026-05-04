'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChatInterface } from '@/components/features/chat/ChatInterface'

export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const conversationId = searchParams.get('id')

  useEffect(() => {
    if (!conversationId) {
      router.push('/dashboard')
    }
  }, [conversationId, router])

  const handleEndConversation = async () => {
    if (!conversationId) return

    try {
      const response = await fetch('/api/chat/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push(`/results?id=${data.analysis.id}`)
      }
    } catch (error) {
      console.error('Error ending conversation:', error)
    }
  }

  if (!conversationId) {
    return null
  }

  return (
    <div className="h-screen bg-white">
      <ChatInterface
        conversationId={conversationId}
        onEnd={handleEndConversation}
      />
    </div>
  )
}
