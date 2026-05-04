import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export class OpenAIService {
  // Generar respuesta de IA con personalidad
  async generateResponse(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    personality: string,
    scenario: string,
    currentInterest: number
  ): Promise<{ content: string; emotion: string; interest: number }> {
    const systemPrompt = this.buildPersonalityPrompt(personality, scenario, currentInterest)
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.8,
      max_tokens: 150,
    })

    const content = completion.choices[0].message.content || ''
    
    // Analizar emoción e interés de la respuesta
    const { emotion, interest } = await this.analyzeResponse(content, messages)
    
    return { content, emotion, interest }
  }

  // Transcribir audio a texto (Whisper)
  async transcribeAudio(audioFile: File): Promise<string> {
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'es',
    })
    
    return transcription.text
  }

  // Convertir texto a voz (TTS)
  async synthesizeSpeech(text: string, voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' = 'nova'): Promise<Buffer> {
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice,
      input: text,
      speed: 1.0,
    })
    
    const buffer = Buffer.from(await mp3.arrayBuffer())
    return buffer
  }

  // Generar análisis completo de la conversación
  async generateAnalysis(
    messages: Array<{ role: string; content: string }>,
    scenario: string,
    duration: number
  ): Promise<{
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
    detailedFeedback: string
    bestMoments: any
    redFlags: any
  }> {
    const analysisPrompt = this.buildAnalysisPrompt(messages, scenario, duration)
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: analysisPrompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const analysis = JSON.parse(completion.choices[0].message.content || '{}')
    return analysis
  }

  // Construir prompt de personalidad
  private buildPersonalityPrompt(personality: string, scenario: string, currentInterest: number): string {
    const basePrompt = `Eres una mujer real en una conversación ${scenario}. Tu personalidad es ${personality}.

REGLAS IMPORTANTES:
- NO eres una IA perfecta, eres una persona real con emociones
- Tu nivel de interés actual es ${currentInterest}/10
- Si el usuario es aburrido o inapropiado, tu interés BAJA
- Si el usuario es interesante, gracioso o carismático, tu interés SUBE
- Responde de forma natural, como en WhatsApp (corto, emojis ocasionales)
- Puedes ser: interesada, neutral, aburrida, molesta, emocionada
- NO des consejos ni actúes como coach
- Reacciona emocionalmente a lo que dice el usuario

PERSONALIDAD ${personality.toUpperCase()}:
${this.getPersonalityTraits(personality)}

ESCENARIO ${scenario.toUpperCase()}:
${this.getScenarioContext(scenario)}

Responde en 1-3 oraciones máximo. Sé auténtica.`

    return basePrompt
  }

  private getPersonalityTraits(personality: string): string {
    const traits: Record<string, string> = {
      friendly: '- Amigable y abierta\n- Sonríe fácilmente\n- Hace preguntas sobre el otro\n- Positiva pero no exagerada',
      flirty: '- Coqueta y juguetona\n- Usa doble sentido ocasionalmente\n- Toca temas más personales\n- Ríe con facilidad',
      challenging: '- Difícil de impresionar\n- Hace preguntas retadoras\n- No se ríe de cualquier cosa\n- Necesita que la sorprendan',
      shy: '- Tímida al principio\n- Respuestas más cortas\n- Se abre gradualmente\n- Dulce pero reservada',
      confident: '- Segura de sí misma\n- Directa y honesta\n- No tiene miedo de desafiar\n- Sabe lo que quiere'
    }
    return traits[personality] || traits.friendly
  }

  private getScenarioContext(scenario: string): string {
    const contexts: Record<string, string> = {
      CASUAL: 'Conversación casual, como conociendo a alguien en un café o evento social.',
      DATE: 'Primera cita. Hay atracción potencial. Evalúas si hay química.',
      PROFESSIONAL: 'Evento de networking profesional. Interesada en conexiones de valor.',
      FLIRTY: 'Contexto de coqueteo. Hay tensión sexual. Juegas pero no eres fácil.',
      CHALLENGING: 'Eres difícil de impresionar. Has escuchado todo. Sorpréndeme.'
    }
    return contexts[scenario] || contexts.CASUAL
  }

  // Analizar emoción e interés de la respuesta
  private async analyzeResponse(
    response: string,
    conversationHistory: Array<{ role: string; content: string }>
  ): Promise<{ emotion: string; interest: number }> {
    // Análisis simple basado en palabras clave
    const lowerResponse = response.toLowerCase()
    
    let emotion = 'neutral'
    let interest = 5

    // Detectar emoción
    if (lowerResponse.includes('jaja') || lowerResponse.includes('😂') || lowerResponse.includes('😄')) {
      emotion = 'happy'
      interest += 1
    } else if (lowerResponse.includes('interesante') || lowerResponse.includes('wow')) {
      emotion = 'interested'
      interest += 2
    } else if (lowerResponse.includes('mmm') || lowerResponse.includes('ok') || lowerResponse.includes('ya')) {
      emotion = 'bored'
      interest -= 1
    } else if (lowerResponse.includes('no') || lowerResponse.includes('pero')) {
      emotion = 'annoyed'
      interest -= 2
    }

    // Ajustar por longitud de respuesta
    if (response.length < 20) interest -= 1
    if (response.length > 100) interest += 1

    // Limitar entre 1-10
    interest = Math.max(1, Math.min(10, interest))

    return { emotion, interest }
  }

  // Construir prompt de análisis
  private buildAnalysisPrompt(
    messages: Array<{ role: string; content: string }>,
    scenario: string,
    duration: number
  ): string {
    const userMessages = messages.filter(m => m.role === 'user').map(m => m.content).join('\n')
    const aiMessages = messages.filter(m => m.role === 'ai').map(m => m.content).join('\n')

    return `Analiza esta conversación de práctica social y proporciona un análisis detallado en formato JSON.

CONTEXTO:
- Escenario: ${scenario}
- Duración: ${duration} segundos
- Mensajes del usuario: ${messages.filter(m => m.role === 'user').length}

MENSAJES DEL USUARIO:
${userMessages}

RESPUESTAS DE LA IA:
${aiMessages}

Proporciona un análisis en el siguiente formato JSON:
{
  "overallScore": <número 1-10>,
  "confidence": <número 1-10>,
  "charisma": <número 1-10>,
  "humor": <número 1-10>,
  "empathy": <número 1-10>,
  "attraction": <número 1-10>,
  "strengths": ["fortaleza1", "fortaleza2", "fortaleza3"],
  "weaknesses": ["debilidad1", "debilidad2"],
  "recommendations": ["recomendación1", "recomendación2", "recomendación3"],
  "aiSummary": "Resumen general en 2-3 oraciones",
  "detailedFeedback": "Feedback detallado de 4-5 párrafos analizando la conversación",
  "bestMoments": {
    "moment1": "Descripción del mejor momento",
    "moment2": "Otro buen momento"
  },
  "redFlags": {
    "flag1": "Señal de alerta detectada",
    "flag2": "Otra señal"
  }
}

CRITERIOS DE EVALUACIÓN:
- Confidence: ¿Qué tan seguro sonó? ¿Evitó ser necesitado?
- Charisma: ¿Fue interesante? ¿Generó emoción?
- Humor: ¿Usó humor apropiadamente? ¿Fue natural?
- Empathy: ¿Escuchó activamente? ¿Hizo buenas preguntas?
- Attraction: ¿Generó tensión sexual apropiada? ¿Fue polarizante?

Sé honesto y constructivo. El objetivo es mejorar habilidades sociales reales.`
  }
}

export const openaiService = new OpenAIService()
