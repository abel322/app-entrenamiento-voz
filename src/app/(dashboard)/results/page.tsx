'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AnalysisCard } from '@/components/features/results/AnalysisCard'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function ResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const analysisId = searchParams.get('id')
  const [analysis, setAnalysis] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!analysisId) {
      router.push('/dashboard')
      return
    }

    // TODO: Fetch analysis from API
    // Por ahora, datos de ejemplo
    setAnalysis({
      overallScore: 7,
      confidence: 8,
      charisma: 6,
      humor: 7,
      empathy: 8,
      attraction: 6,
      strengths: [
        'Buena escucha activa',
        'Humor natural y apropiado',
        'Empatía genuina',
      ],
      weaknesses: [
        'Falta de polarización',
        'Demasiado acuerdo',
      ],
      recommendations: [
        'Sé más directo con tus intenciones',
        'Crea más tensión sexual apropiada',
        'No tengas miedo de desafiar ocasionalmente',
      ],
      aiSummary: 'Conversación sólida con buena base. Tienes habilidades naturales de empatía y humor, pero podrías ser más polarizante.',
    })
    setIsLoading(false)
  }, [analysisId, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Analizando conversación...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Dashboard
        </Button>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
          Análisis de Conversación
        </h1>

        {analysis && <AnalysisCard analysis={analysis} />}

        <div className="mt-8 text-center">
          <Button size="lg" onClick={() => router.push('/dashboard')}>
            Nueva Conversación
          </Button>
        </div>
      </div>
    </div>
  )
}
