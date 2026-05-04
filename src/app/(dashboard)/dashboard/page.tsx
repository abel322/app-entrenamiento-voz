'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { StatsCard } from '@/components/features/dashboard/StatsCard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MessageSquare, TrendingUp, Flame, Award } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalConversations: 0,
    averageScore: 0,
    currentStreak: 0,
    conversationsThisMonth: 0,
  })

  const scenarios = [
    { id: 'CASUAL', name: 'Casual', emoji: '☕', description: 'Conversación relajada' },
    { id: 'DATE', name: 'Primera Cita', emoji: '💕', description: 'Práctica de citas' },
    { id: 'PROFESSIONAL', name: 'Networking', emoji: '💼', description: 'Contexto profesional' },
    { id: 'FLIRTY', name: 'Coqueteo', emoji: '😏', description: 'Nivel avanzado' },
    { id: 'CHALLENGING', name: 'Desafiante', emoji: '🔥', description: 'Modo difícil' },
  ]

  const startConversation = async (scenario: string) => {
    try {
      const response = await fetch('/api/chat/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push(`/chat?id=${data.conversation.id}`)
      } else {
        alert(data.error || 'Error al iniciar conversación')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al iniciar conversación')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">Elige un escenario para comenzar a practicar</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Conversaciones"
            value={stats.totalConversations}
            icon={MessageSquare}
            gradient
          />
          <StatsCard
            title="Puntuación Promedio"
            value={`${stats.averageScore}/10`}
            icon={Award}
          />
          <StatsCard
            title="Racha Actual"
            value={`${stats.currentStreak} días`}
            icon={Flame}
          />
          <StatsCard
            title="Este Mes"
            value={`${stats.conversationsThisMonth}/3`}
            icon={TrendingUp}
          />
        </div>

        {/* Escenarios */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Escenarios Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarios.map((scenario) => (
              <Card key={scenario.id} hover className="cursor-pointer">
                <div className="text-center">
                  <div className="text-5xl mb-3">{scenario.emoji}</div>
                  <h3 className="text-xl font-bold mb-2">{scenario.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{scenario.description}</p>
                  <Button
                    onClick={() => startConversation(scenario.id)}
                    className="w-full"
                  >
                    Comenzar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Upgrade */}
        <Card gradient className="mt-8 text-center">
          <h3 className="text-2xl font-bold mb-2">¿Quieres más conversaciones?</h3>
          <p className="text-gray-600 mb-4">
            Actualiza a Pro y obtén 30 conversaciones al mes
          </p>
          <Button size="lg" onClick={() => router.push('/pricing')}>
            Ver Planes
          </Button>
        </Card>
      </div>
    </div>
  )
}
