'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

export default function PricingPage() {
  const router = useRouter()
  const [billingPeriod, setBillingPeriod] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY')
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const plans = [
    {
      id: 'FREE',
      name: 'Free',
      price: { MONTHLY: 0, YEARLY: 0 },
      description: 'Perfecto para empezar',
      features: [
        '3 conversaciones al mes',
        'Máximo 5 minutos por conversación',
        'Análisis básico',
        'Escenario casual',
      ],
      cta: 'Plan Actual',
      disabled: true,
    },
    {
      id: 'PRO',
      name: 'Pro',
      price: { MONTHLY: 19, YEARLY: 190 },
      description: 'Para practicar regularmente',
      features: [
        '30 conversaciones al mes',
        'Máximo 15 minutos por conversación',
        'Análisis detallado con 6 métricas',
        'Todos los escenarios',
        'Historial completo',
        'Soporte por email',
      ],
      cta: 'Comenzar Pro',
      popular: true,
    },
    {
      id: 'PREMIUM',
      name: 'Premium',
      price: { MONTHLY: 49, YEARLY: 490 },
      description: 'Para máximo progreso',
      features: [
        'Conversaciones ilimitadas',
        'Máximo 30 minutos por conversación',
        'Análisis comprehensivo',
        'Todos los escenarios + personalizados',
        'Historial ilimitado',
        'Soporte prioritario',
        'Acceso anticipado a nuevas features',
      ],
      cta: 'Comenzar Premium',
    },
  ]

  const handleSubscribe = async (planId: string) => {
    if (planId === 'FREE') return

    setIsLoading(planId)

    try {
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planId,
          billingPeriod,
        }),
      })

      const data = await response.json()

      if (response.ok && data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Error al crear suscripción')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al procesar suscripción')
    } finally {
      setIsLoading(null)
    }
  }

  const getSavings = (monthlyPrice: number, yearlyPrice: number) => {
    const monthlyCost = monthlyPrice * 12
    const savings = monthlyCost - yearlyPrice
    const percentage = Math.round((savings / monthlyCost) * 100)
    return { savings, percentage }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Elige tu Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Mejora tus habilidades sociales al ritmo que necesites
          </p>

          {/* Toggle Billing Period */}
          <div className="inline-flex items-center gap-4 bg-white rounded-full p-2 shadow-lg">
            <button
              onClick={() => setBillingPeriod('MONTHLY')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingPeriod === 'MONTHLY'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setBillingPeriod('YEARLY')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingPeriod === 'YEARLY'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Anual
              <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                Ahorra 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => {
            const price = plan.price[billingPeriod]
            const { savings, percentage } = getSavings(
              plan.price.MONTHLY,
              plan.price.YEARLY
            )

            return (
              <Card
                key={plan.id}
                className={`relative ${
                  plan.popular
                    ? 'border-4 border-purple-500 shadow-2xl scale-105'
                    : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                      Más Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                  
                  <div className="mb-2">
                    <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      ${price}
                    </span>
                    {price > 0 && (
                      <span className="text-gray-600">
                        /{billingPeriod === 'MONTHLY' ? 'mes' : 'año'}
                      </span>
                    )}
                  </div>

                  {billingPeriod === 'YEARLY' && price > 0 && (
                    <p className="text-sm text-green-600 font-medium">
                      Ahorras ${savings} ({percentage}%)
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={plan.disabled || isLoading === plan.id}
                  isLoading={isLoading === plan.id}
                  variant={plan.popular ? 'primary' : 'secondary'}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </Card>
            )
          })}
        </div>

        {/* FAQ */}
        <Card className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Preguntas Frecuentes
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">¿Puedo cancelar en cualquier momento?</h3>
              <p className="text-gray-600 text-sm">
                Sí, puedes cancelar tu suscripción en cualquier momento desde tu dashboard.
                No hay compromisos a largo plazo.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">¿Qué métodos de pago aceptan?</h3>
              <p className="text-gray-600 text-sm">
                Aceptamos todas las tarjetas de crédito y débito principales a través de Stripe.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">¿Puedo cambiar de plan después?</h3>
              <p className="text-gray-600 text-sm">
                Sí, puedes actualizar o degradar tu plan en cualquier momento.
                Los cambios se aplican inmediatamente.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">¿Hay reembolsos?</h3>
              <p className="text-gray-600 text-sm">
                Ofrecemos reembolso completo dentro de los primeros 7 días si no estás satisfecho.
              </p>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
          >
            Volver al Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
