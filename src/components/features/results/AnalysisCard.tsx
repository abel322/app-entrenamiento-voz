'use client'

import { Card } from '@/components/ui/card'
import { CheckCircle, XCircle, Lightbulb } from 'lucide-react'

interface Analysis {
  overallScore: number
  confidence: number
  charisma: number
  humor: number
  empathy: number
  attraction: number
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  aiSummary: string
}

interface AnalysisCardProps {
  analysis: Analysis
}

export function AnalysisCard({ analysis }: AnalysisCardProps) {
  const scores = [
    { label: 'Confianza', value: analysis.confidence },
    { label: 'Carisma', value: analysis.charisma },
    { label: 'Humor', value: analysis.humor },
    { label: 'Empatía', value: analysis.empathy },
    { label: 'Atracción', value: analysis.attraction },
  ]

  return (
    <div className="space-y-6">
      {/* Puntuación General */}
      <Card gradient className="text-center">
        <h3 className="text-lg font-semibold mb-2">Puntuación General</h3>
        <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {analysis.overallScore}/10
        </div>
        <p className="mt-4 text-gray-600">{analysis.aiSummary}</p>
      </Card>

      {/* Métricas Detalladas */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Análisis Detallado</h3>
        <div className="space-y-4">
          {scores.map((score) => (
            <div key={score.label}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">{score.label}</span>
                <span className="text-sm font-bold text-purple-600">
                  {score.value}/10
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${score.value * 10}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Fortalezas */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold">Fortalezas</h3>
        </div>
        <ul className="space-y-2">
          {analysis.strengths.map((strength, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span className="text-gray-700">{strength}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Áreas de Mejora */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <XCircle className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold">Áreas de Mejora</h3>
        </div>
        <ul className="space-y-2">
          {analysis.weaknesses.map((weakness, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-orange-600 mt-1">!</span>
              <span className="text-gray-700">{weakness}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Recomendaciones */}
      <Card gradient>
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold">Recomendaciones</h3>
        </div>
        <ul className="space-y-3">
          {analysis.recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-purple-600 font-bold mt-1">{i + 1}.</span>
              <span className="text-gray-700">{rec}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
