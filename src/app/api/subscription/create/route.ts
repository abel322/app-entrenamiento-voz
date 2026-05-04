import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { stripeService } from '@/lib/services/stripe'
import { z } from 'zod'

const createSubscriptionSchema = z.object({
  plan: z.enum(['PRO', 'PREMIUM']),
  billingPeriod: z.enum(['MONTHLY', 'YEARLY']),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const data = createSubscriptionSchema.parse(body)

    const checkoutSession = await stripeService.createCheckoutSession(
      session.user.id,
      data.plan,
      data.billingPeriod
    )

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error: any) {
    console.error('Error creating subscription:', error)
    return NextResponse.json(
      { error: error.message || 'Error al crear suscripción' },
      { status: 500 }
    )
  }
}
