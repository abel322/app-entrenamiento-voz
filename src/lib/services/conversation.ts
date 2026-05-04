import { prisma } from '@/lib/db/prisma'
import { openaiService } from './openai'
import { Scenario } from '@prisma/client'

export class ConversationService {
  // Iniciar nueva conversación
  async startConversation(
    userId: string,
    scenario: Scenario,
    personality: string = 'friendly',
    difficulty: number = 5
  ) {
    // Verificar límites del usuario
    const canStart = await this.checkUserLimits(userId)
    if (!canStart.allowed) {
      throw new Error(canStart.reason)
    }

    // Crear conversación
    const conversation = await prisma.conversation.create({
      data: {
        userId,
        scenario,
        aiPersonality: personality,
        difficulty,
        status: 'ACTIVE',
      },
    })

    // Incrementar contador mensual
    await prisma.user.update({
      where: { id: userId },
      data: { conversationsThisMonth: { increment: 1 } },
    })

    // Mensaje inicial de la IA
    const initialMessage = await this.generateInitialMessage(scenario, personality)
    
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'AI',
        content: initialMessage.content,
        aiEmotion: initialMessage.emotion,
        aiInterest: initialMessage.interest,
      },
    })

    return conversation
  }

  // Enviar mensaje del usuario
  async sendMessage(conversationId: string, content: string, audioUrl?: string) {
    // Verificar que la conversación esté activa
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
          take: 20, // Últimos 20 mensajes para contexto
        },
      },
    })

    if (!conversation || conversation.status !== 'ACTIVE') {
      throw new Error('Conversación no disponible')
    }

    // Guardar mensaje del usuario
    const userMessage = await prisma.message.create({
      data: {
        conversationId,
        role: 'USER',
        content,
        audioUrl,
      },
    })

    // Preparar contexto para la IA
    const messages = conversation.messages.map(m => ({
      role: m.role === 'USER' ? 'user' as const : 'assistant' as const,
      content: m.content,
    }))

    messages.push({ role: 'user', content })

    // Obtener último nivel de interés
    const lastAiMessage = conversation.messages
      .filter(m => m.role === 'AI')
      .pop()
    const currentInterest = lastAiMessage?.aiInterest || 5

    // Generar respuesta de la IA
    const aiResponse = await openaiService.generateResponse(
      messages,
      conversation.aiPersonality,
      conversation.scenario,
      currentInterest
    )

    // Guardar respuesta de la IA
    const aiMessage = await prisma.message.create({
      data: {
        conversationId,
        role: 'AI',
        content: aiResponse.content,
        aiEmotion: aiResponse.emotion,
        aiInterest: aiResponse.interest,
      },
    })

    // Actualizar contador de mensajes
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { messageCount: { increment: 2 } },
    })

    return {
      userMessage,
      aiMessage,
      aiEmotion: aiResponse.emotion,
      aiInterest: aiResponse.interest,
    }
  }

  // Finalizar conversación
  async endConversation(conversationId: string) {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
        },
      },
    })

    if (!conversation) {
      throw new Error('Conversación no encontrada')
    }

    // Calcular duración
    const startTime = conversation.startedAt.getTime()
    const endTime = Date.now()
    const duration = Math.floor((endTime - startTime) / 1000)

    // Actualizar conversación
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        status: 'COMPLETED',
        endedAt: new Date(),
        duration,
      },
    })

    // Generar análisis
    const messages = conversation.messages.map(m => ({
      role: m.role.toLowerCase(),
      content: m.content,
    }))

    const analysis = await openaiService.generateAnalysis(
      messages,
      conversation.scenario,
      duration
    )

    // Guardar análisis
    const savedAnalysis = await prisma.analysis.create({
      data: {
        conversationId,
        userId: conversation.userId,
        overallScore: analysis.overallScore,
        confidence: analysis.confidence,
        charisma: analysis.charisma,
        humor: analysis.humor,
        empathy: analysis.empathy,
        attraction: analysis.attraction,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        recommendations: analysis.recommendations,
        bestMoments: JSON.stringify(analysis.bestMoments),
        redFlags: JSON.stringify(analysis.redFlags),
        aiSummary: analysis.aiSummary,
        detailedFeedback: analysis.detailedFeedback,
      },
    })

    // Actualizar estadísticas del usuario
    await this.updateUserStats(conversation.userId, analysis.overallScore, duration)

    return savedAnalysis
  }

  // Verificar límites del usuario
  private async checkUserLimits(userId: string): Promise<{ allowed: boolean; reason?: string }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionTier: true,
        conversationsThisMonth: true,
        lastResetDate: true,
      },
    })

    if (!user) {
      return { allowed: false, reason: 'Usuario no encontrado' }
    }

    // Resetear contador si es nuevo mes
    const now = new Date()
    const lastReset = new Date(user.lastResetDate)
    if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          conversationsThisMonth: 0,
          lastResetDate: now,
        },
      })
      return { allowed: true }
    }

    // Verificar límites por plan
    const limits: Record<string, number> = {
      FREE: 3,
      PRO: 30,
      PREMIUM: -1, // ilimitado
    }

    const limit = limits[user.subscriptionTier]
    if (limit === -1) return { allowed: true }

    if (user.conversationsThisMonth >= limit) {
      return {
        allowed: false,
        reason: `Has alcanzado el límite de ${limit} conversaciones este mes. Actualiza tu plan para continuar.`,
      }
    }

    return { allowed: true }
  }

  // Generar mensaje inicial
  private async generateInitialMessage(scenario: Scenario, personality: string) {
    const greetings: Record<string, string[]> = {
      CASUAL: ['Hola! ¿Qué tal?', 'Hey! ¿Cómo estás?', 'Hola! ¿Qué haces por aquí?'],
      DATE: ['Hola! Llegaste puntual 😊', 'Hey! Me alegra que vinieras', 'Hola! ¿Cómo estuvo tu día?'],
      PROFESSIONAL: ['Hola! Encantada de conocerte', 'Hey! ¿A qué te dedicas?', 'Hola! ¿Primera vez en este evento?'],
      FLIRTY: ['Hola... 😏', 'Hey, no esperaba verte aquí', 'Hola! Tienes buena pinta'],
      CHALLENGING: ['Hola.', 'Hey.', 'Hola, ¿y tú eres...?'],
    }

    const options = greetings[scenario] || greetings.CASUAL
    const content = options[Math.floor(Math.random() * options.length)]

    return {
      content,
      emotion: 'neutral',
      interest: 5,
    }
  }

  // Actualizar estadísticas del usuario
  private async updateUserStats(userId: string, score: number, duration: number) {
    const stats = await prisma.userStats.findUnique({
      where: { userId },
    })

    const durationMinutes = Math.floor(duration / 60)

    if (!stats) {
      await prisma.userStats.create({
        data: {
          userId,
          totalConversations: 1,
          totalMinutes: durationMinutes,
          averageScore: score,
          currentStreak: 1,
          longestStreak: 1,
          lastConversationDate: new Date(),
        },
      })
    } else {
      const newTotal = stats.totalConversations + 1
      const newAverage = Math.round(
        (stats.averageScore * stats.totalConversations + score) / newTotal
      )

      // Calcular racha
      const lastDate = stats.lastConversationDate
      const today = new Date()
      const daysDiff = lastDate
        ? Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
        : 999

      let newStreak = stats.currentStreak
      if (daysDiff === 0) {
        // Mismo día, mantener racha
      } else if (daysDiff === 1) {
        // Día consecutivo, incrementar
        newStreak += 1
      } else {
        // Racha rota
        newStreak = 1
      }

      await prisma.userStats.update({
        where: { userId },
        data: {
          totalConversations: newTotal,
          totalMinutes: { increment: durationMinutes },
          averageScore: newAverage,
          currentStreak: newStreak,
          longestStreak: Math.max(stats.longestStreak, newStreak),
          lastConversationDate: today,
        },
      })
    }
  }
}

export const conversationService = new ConversationService()
