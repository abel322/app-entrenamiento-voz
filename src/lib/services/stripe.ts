import Stripe from 'stripe'
import { prisma } from '@/lib/db/prisma'

export class StripeService {
  private stripe: Stripe | null = null

  private getClient() {
    if (!this.stripe) {
      this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_key', {
        apiVersion: '2024-11-20.acacia',
      })
    }
    return this.stripe
  }
  // Crear sesión de checkout
  async createCheckoutSession(
    userId: string,
    plan: 'PRO' | 'PREMIUM',
    billingPeriod: 'MONTHLY' | 'YEARLY'
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new Error('Usuario no encontrado')
    }

    // Precios (en centavos)
    const prices: Record<string, Record<string, string>> = {
      PRO: {
        MONTHLY: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
        YEARLY: process.env.STRIPE_PRO_YEARLY_PRICE_ID!,
      },
      PREMIUM: {
        MONTHLY: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID!,
        YEARLY: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID!,
      },
    }

    const priceId = prices[plan][billingPeriod]

    // Crear o recuperar cliente de Stripe
    let customerId = user.stripeCustomerId

    if (!customerId) {
      const customer = await this.getClient().customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
        },
      })
      customerId = customer.id

      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      })
    }

    // Crear sesión de checkout
    const session = await this.getClient().checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
      metadata: {
        userId,
        plan,
        billingPeriod,
      },
    })

    return session
  }

  // Manejar webhook de Stripe
  async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.Invoice)
        break
    }
  }

  private async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId
    const plan = session.metadata?.plan as 'PRO' | 'PREMIUM'

    if (!userId || !plan) return

    const subscription = await this.getClient().subscriptions.retrieve(session.subscription as string)

    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionTier: plan,
        subscriptionStatus: 'ACTIVE',
        stripeSubscriptionId: subscription.id,
        subscriptionEndsAt: new Date(subscription.current_period_end * 1000),
      },
    })
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const user = await prisma.user.findFirst({
      where: { stripeSubscriptionId: subscription.id },
    })

    if (!user) return

    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: subscription.status === 'active' ? 'ACTIVE' : 'PAST_DUE',
        subscriptionEndsAt: new Date(subscription.current_period_end * 1000),
      },
    })
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const user = await prisma.user.findFirst({
      where: { stripeSubscriptionId: subscription.id },
    })

    if (!user) return

    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionTier: 'FREE',
        subscriptionStatus: 'CANCELED',
        stripeSubscriptionId: null,
        subscriptionEndsAt: null,
      },
    })
  }

  private async handlePaymentSucceeded(invoice: Stripe.Invoice) {
    const customerId = invoice.customer as string
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: customerId },
    })

    if (!user) return

    await prisma.payment.create({
      data: {
        userId: user.id,
        stripePaymentId: invoice.payment_intent as string,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        status: 'SUCCEEDED',
        plan: user.subscriptionTier,
        billingPeriod: invoice.billing_reason === 'subscription_create' ? 'MONTHLY' : 'MONTHLY',
      },
    })
  }

  private async handlePaymentFailed(invoice: Stripe.Invoice) {
    const customerId = invoice.customer as string
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: customerId },
    })

    if (!user) return

    await prisma.user.update({
      where: { id: user.id },
      data: { subscriptionStatus: 'PAST_DUE' },
    })
  }

  // Cancelar suscripción
  async cancelSubscription(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user?.stripeSubscriptionId) {
      throw new Error('No hay suscripción activa')
    }

    await this.getClient().subscriptions.cancel(user.stripeSubscriptionId)

    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: 'CANCELED',
      },
    })
  }
}

export const stripeService = new StripeService()
