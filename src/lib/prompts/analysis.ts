// Prompts para análisis de conversaciones

export function buildAnalysisPrompt(
  messages: Array<{ role: string; content: string }>,
  scenario: string,
  duration: number
): string {
  const userMessages = messages.filter(m => m.role === 'user')
  const aiMessages = messages.filter(m => m.role === 'ai')
  
  const conversationText = messages
    .map(m => `${m.role === 'user' ? 'Usuario' : 'IA'}: ${m.content}`)
    .join('\n')

  return `Analiza esta conversación de práctica social y proporciona un análisis HONESTO y CONSTRUCTIVO.

CONTEXTO:
- Escenario: ${scenario}
- Duración: ${Math.floor(duration / 60)} minutos
- Mensajes del usuario: ${userMessages.length}
- Mensajes de la IA: ${aiMessages.length}

CONVERSACIÓN COMPLETA:
${conversationText}

INSTRUCCIONES:
Proporciona un análisis en formato JSON con la siguiente estructura:

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
  "detailedFeedback": "Feedback detallado de 4-5 párrafos",
  "bestMoments": {
    "moment1": "Descripción del mejor momento",
    "moment2": "Otro buen momento"
  },
  "redFlags": {
    "flag1": "Señal de alerta si existe",
    "flag2": "Otra señal si existe"
  }
}

CRITERIOS DE EVALUACIÓN:

1. CONFIDENCE (Confianza) - 1-10
   - ¿Qué tan seguro sonó?
   - ¿Evitó ser necesitado o buscar aprobación?
   - ¿Fue directo sin ser agresivo?
   - ¿Mantuvo su frame?
   Señales de baja confianza: "por favor", "si quieres", "no sé", exceso de disculpas
   Señales de alta confianza: Afirmaciones directas, humor, no buscar validación

2. CHARISMA (Carisma) - 1-10
   - ¿Fue interesante y único?
   - ¿Generó emoción en la conversación?
   - ¿Tuvo energía positiva?
   - ¿Contó historias o fue genérico?
   Señales de bajo carisma: Respuestas cortas, genéricas, aburridas
   Señales de alto carisma: Historias, humor, energía, originalidad

3. HUMOR (Humor) - 1-10
   - ¿Usó humor apropiadamente?
   - ¿Fue natural o forzado?
   - ¿Hizo reír a la IA?
   - ¿Timing apropiado?
   Señales de buen humor: Respuestas de risa de la IA, juegos de palabras, observaciones ingeniosas
   Señales de mal humor: Chistes inapropiados, forzados, o ningún humor

4. EMPATHY (Empatía) - 1-10
   - ¿Escuchó activamente?
   - ¿Hizo preguntas sobre la otra persona?
   - ¿Mostró interés genuino?
   - ¿Conectó emocionalmente?
   Señales de baja empatía: Solo hablar de sí mismo, no hacer preguntas
   Señales de alta empatía: Preguntas de seguimiento, validación emocional

5. ATTRACTION (Atracción) - 1-10
   - ¿Generó tensión sexual apropiada? (si aplica al escenario)
   - ¿Fue polarizante o demasiado "nice"?
   - ¿Creó misterio e intriga?
   - ¿Fue desafiante ocasionalmente?
   Señales de baja atracción: Demasiado acuerdo, necesitado, aburrido
   Señales de alta atracción: Juguetón, desafiante, misterioso, confiado

FORTALEZAS:
Identifica 3 cosas que hizo BIEN. Sé específico.

DEBILIDADES:
Identifica 2 áreas de mejora. Sé honesto pero constructivo.

RECOMENDACIONES:
Da 3 consejos ACCIONABLES para mejorar. Sé específico y práctico.

BEST MOMENTS:
Identifica 1-2 momentos donde brilló. Cita el mensaje específico.

RED FLAGS:
Identifica comportamientos problemáticos si existen:
- Necesidad excesiva
- Falta de respeto
- Demasiado sexual muy rápido
- Aburrido/genérico
- Buscar aprobación constantemente

AI SUMMARY:
Resumen ejecutivo en 2-3 oraciones. Sé honesto y directo.

DETAILED FEEDBACK:
Análisis profundo en 4-5 párrafos cubriendo:
1. Primera impresión y apertura
2. Desarrollo de la conversación
3. Puntos fuertes específicos
4. Áreas de mejora específicas
5. Consejo final y siguiente paso

SÉ HONESTO. SÉ CONSTRUCTIVO. SÉ ESPECÍFICO.
El objetivo es MEJORAR habilidades sociales reales, no inflar el ego.`
}

export const ANALYSIS_EXAMPLES = {
  highScore: {
    overallScore: 8,
    confidence: 9,
    charisma: 8,
    humor: 8,
    empathy: 7,
    attraction: 8,
    strengths: [
      'Excelente uso de humor natural y timing',
      'Confianza genuina sin arrogancia',
      'Buena mezcla de hablar y escuchar',
    ],
    weaknesses: [
      'Podría hacer más preguntas profundas',
      'Faltó un poco de tensión sexual',
    ],
    recommendations: [
      'Incorpora más "push-pull" en tus interacciones',
      'Haz preguntas que generen emoción, no solo información',
      'Sé más polarizante ocasionalmente',
    ],
  },

  mediumScore: {
    overallScore: 5,
    confidence: 6,
    charisma: 5,
    humor: 4,
    empathy: 6,
    attraction: 4,
    strengths: [
      'Educado y respetuoso',
      'Intentó mantener la conversación',
      'Mostró interés básico',
    ],
    weaknesses: [
      'Demasiado genérico y predecible',
      'Falta de humor y energía',
      'Muy "nice guy", falta polarización',
    ],
    recommendations: [
      'Cuenta historias en lugar de dar respuestas cortas',
      'Usa más humor y juego',
      'No tengas miedo de desafiar ocasionalmente',
    ],
  },

  lowScore: {
    overallScore: 3,
    confidence: 2,
    charisma: 3,
    humor: 2,
    empathy: 4,
    attraction: 2,
    strengths: [
      'Intentó ser amable',
      'Respondió a las preguntas',
    ],
    weaknesses: [
      'Demasiado necesitado y buscando aprobación',
      'Respuestas muy cortas y aburridas',
      'Falta total de humor y energía',
      'Demasiado rápido con cumplidos',
    ],
    recommendations: [
      'Trabaja en tu confianza: no busques validación',
      'Desarrolla tu personalidad: sé más interesante',
      'Aprende a crear tensión en lugar de ser solo "nice"',
    ],
  },
}

export function getScoreInterpretation(score: number): string {
  if (score >= 8) return 'Excelente - Habilidades sociales muy desarrolladas'
  if (score >= 6) return 'Bueno - Sólida base, con espacio para mejorar'
  if (score >= 4) return 'Promedio - Necesitas trabajar en varias áreas'
  return 'Necesita mejora - Enfócate en los fundamentos'
}

export function getMetricFeedback(metric: string, score: number): string {
  const feedback: Record<string, Record<string, string>> = {
    confidence: {
      high: 'Proyectas seguridad genuina sin arrogancia',
      medium: 'Tienes confianza básica pero a veces buscas aprobación',
      low: 'Trabajar en confianza es tu prioridad #1',
    },
    charisma: {
      high: 'Eres naturalmente interesante y magnético',
      medium: 'Tienes momentos de carisma pero no es consistente',
      low: 'Necesitas desarrollar tu personalidad única',
    },
    humor: {
      high: 'Tu humor es natural y bien calibrado',
      medium: 'Usas humor ocasionalmente pero podría ser más natural',
      low: 'Incorporar más humor mejoraría mucho tus interacciones',
    },
    empathy: {
      high: 'Excelente escucha activa y conexión emocional',
      medium: 'Muestras interés pero podrías profundizar más',
      low: 'Necesitas escuchar más y hablar menos de ti',
    },
    attraction: {
      high: 'Generas tensión sexual apropiada y eres polarizante',
      medium: 'Hay atracción básica pero falta tensión',
      low: 'Demasiado "nice" - necesitas ser más desafiante',
    },
  }

  const level = score >= 7 ? 'high' : score >= 5 ? 'medium' : 'low'
  return feedback[metric]?.[level] || ''
}
