import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MessageSquare, TrendingUp, Award, Zap } from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: MessageSquare,
      title: 'Conversaciones Reales',
      description: 'Practica con IA que responde como una persona real, no perfecta',
    },
    {
      icon: TrendingUp,
      title: 'Análisis Detallado',
      description: 'Recibe feedback sobre confianza, carisma, humor y más',
    },
    {
      icon: Award,
      title: 'Múltiples Escenarios',
      description: 'Desde casual hasta citas, networking y más',
    },
    {
      icon: Zap,
      title: 'Mejora Continua',
      description: 'Trackea tu progreso y ve tu evolución',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Hero */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Social Coach
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Mejora tus habilidades sociales conversando con IA realista.
            Recibe análisis detallado y conviértete en la mejor versión de ti mismo.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg">Comenzar Gratis</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="secondary">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {features.map((feature) => (
            <Card key={feature.title} hover className="text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <Card gradient className="mt-20 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Comienza tu transformación hoy
          </h2>
          <p className="text-gray-600 mb-6">
            3 conversaciones gratis. Sin tarjeta de crédito.
          </p>
          <Link href="/register">
            <Button size="lg">Crear Cuenta Gratis</Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}
