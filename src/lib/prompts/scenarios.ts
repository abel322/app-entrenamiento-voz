// Variaciones de escenarios y situaciones específicas

export const SCENARIO_VARIATIONS = {
  CASUAL: {
    locations: [
      'café',
      'evento social',
      'fiesta de amigos',
      'clase o taller',
      'gimnasio',
      'librería',
    ],
    
    openingLines: [
      'Hola! ¿Qué tal?',
      'Hey! ¿Cómo estás?',
      'Hola! ¿Qué haces por aquí?',
      'Hey! ¿Primera vez aquí?',
      'Hola! Me pareció verte antes',
    ],
    
    topics: [
      'Hobbies y pasatiempos',
      'Trabajo o estudios',
      'Viajes y experiencias',
      'Música y entretenimiento',
      'Deportes y fitness',
      'Comida y restaurantes',
    ],
  },

  DATE: {
    locations: [
      'restaurante',
      'bar de cócteles',
      'cafetería especial',
      'galería de arte',
      'parque',
    ],
    
    openingLines: [
      'Hola! Llegaste puntual 😊',
      'Hey! Me alegra que vinieras',
      'Hola! ¿Cómo estuvo tu día?',
      'Hey! Te ves bien 😊',
      'Hola! ¿Encontraste fácil el lugar?',
    ],
    
    topics: [
      'Pasiones y sueños',
      'Experiencias de vida',
      'Valores personales',
      'Familia (superficial)',
      'Planes futuros (general)',
      'Historias divertidas',
    ],
    
    redFlags: [
      'Hablar de ex parejas',
      'Ser demasiado sexual',
      'Quejarse mucho',
      'Hablar solo de trabajo',
      'Ser necesitado',
      'Preguntar sobre futuro muy serio',
    ],
  },

  PROFESSIONAL: {
    locations: [
      'conferencia',
      'evento de networking',
      'after-work',
      'feria de industria',
      'reunión profesional',
    ],
    
    openingLines: [
      'Hola! Encantada de conocerte',
      'Hey! ¿A qué te dedicas?',
      'Hola! ¿Primera vez en este evento?',
      'Hey! ¿Cómo va el evento para ti?',
      'Hola! Vi tu presentación, interesante',
    ],
    
    topics: [
      'Carrera y trayectoria',
      'Proyectos actuales',
      'Industria y tendencias',
      'Objetivos profesionales',
      'Networking y conexiones',
      'Aprendizajes recientes',
    ],
    
    redFlags: [
      'Ser demasiado personal',
      'Coquetear inapropiadamente',
      'Hablar mal de otros',
      'Ser demasiado vendedor',
      'No escuchar',
    ],
  },

  FLIRTY: {
    locations: [
      'bar nocturno',
      'club',
      'fiesta privada',
      'after-party',
      'lounge',
    ],
    
    openingLines: [
      'Hola... 😏',
      'Hey, no esperaba verte aquí',
      'Hola! Tienes buena pinta',
      'Hey... ¿vienes seguido?',
      'Hola! Me llamaste la atención',
    ],
    
    topics: [
      'Atracción y química',
      'Experiencias románticas (sutiles)',
      'Deseos y fantasías (implícitos)',
      'Juego y provocación',
      'Tensión sexual',
      'Misterio e intriga',
    ],
    
    techniques: [
      'Push-pull',
      'Doble sentido',
      'Contacto visual intenso',
      'Proximidad física (verbal)',
      'Desafío juguetón',
      'Crear anticipación',
    ],
  },

  CHALLENGING: {
    personas: [
      'Mujer exitosa y exigente',
      'Modelo o influencer',
      'Empresaria de alto nivel',
      'Artista reconocida',
      'Profesional destacada',
    ],
    
    openingLines: [
      'Hola.',
      'Hey.',
      'Hola, ¿y tú eres...?',
      'Hey. ¿Nos conocemos?',
      'Hola. ¿Qué haces aquí?',
    ],
    
    challenges: [
      'Respuestas cortas',
      'Preguntas difíciles',
      'Tests de congruencia',
      'Desinterés aparente',
      'Estándares altos',
      'Necesidad de impresionar',
    ],
    
    whatWorks: [
      'Confianza genuina',
      'No buscar aprobación',
      'Ser único e interesante',
      'Desafiar apropiadamente',
      'Humor inteligente',
      'No intimidarse',
    ],
  },
}

export const DIFFICULTY_MODIFIERS = {
  1: {
    name: 'Muy Fácil',
    aiInterestStart: 7,
    aiPatience: 'high',
    aiReactivity: 'positive',
    description: 'La IA es muy receptiva y positiva',
  },
  3: {
    name: 'Fácil',
    aiInterestStart: 6,
    aiPatience: 'medium-high',
    aiReactivity: 'mostly-positive',
    description: 'La IA es receptiva pero no perfecta',
  },
  5: {
    name: 'Normal',
    aiInterestStart: 5,
    aiPatience: 'medium',
    aiReactivity: 'balanced',
    description: 'La IA reacciona de forma realista',
  },
  7: {
    name: 'Difícil',
    aiInterestStart: 4,
    aiPatience: 'low',
    aiReactivity: 'critical',
    description: 'La IA es más crítica y difícil de impresionar',
  },
  10: {
    name: 'Muy Difícil',
    aiInterestStart: 3,
    aiPatience: 'very-low',
    aiReactivity: 'harsh',
    description: 'La IA es muy exigente y directa',
  },
}

export function getScenarioInstructions(scenario: string, difficulty: number): string {
  const scenarioData = SCENARIO_VARIATIONS[scenario as keyof typeof SCENARIO_VARIATIONS]
  const difficultyData = DIFFICULTY_MODIFIERS[difficulty as keyof typeof DIFFICULTY_MODIFIERS] || DIFFICULTY_MODIFIERS[5]

  let instructions = `DIFICULTAD: ${difficultyData.name} (${difficulty}/10)
${difficultyData.description}

`

  if (scenario === 'DATE') {
    instructions += `SEÑALES DE ALERTA A EVITAR:
${scenarioData.redFlags?.map(flag => `- ${flag}`).join('\n')}

`
  }

  if (scenario === 'FLIRTY') {
    instructions += `TÉCNICAS QUE FUNCIONAN:
${scenarioData.techniques?.map(tech => `- ${tech}`).join('\n')}

`
  }

  if (scenario === 'CHALLENGING') {
    instructions += `LO QUE FUNCIONA CONTIGO:
${scenarioData.whatWorks?.map(work => `- ${work}`).join('\n')}

DESAFÍOS QUE PRESENTAS:
${scenarioData.challenges?.map(challenge => `- ${challenge}`).join('\n')}

`
  }

  return instructions
}

export const CONVERSATION_STAGES = {
  opening: {
    messageRange: [0, 3],
    focus: 'Primera impresión',
    tips: [
      'Sé confiado pero no arrogante',
      'Usa humor ligero',
      'Haz una observación interesante',
      'No seas genérico',
    ],
  },
  
  building: {
    messageRange: [4, 10],
    focus: 'Construir conexión',
    tips: [
      'Alterna entre hablar y escuchar',
      'Cuenta historias, no solo hechos',
      'Haz preguntas que generen emoción',
      'Crea rapport',
    ],
  },
  
  deepening: {
    messageRange: [11, 20],
    focus: 'Profundizar conexión',
    tips: [
      'Toca temas más personales',
      'Muestra vulnerabilidad apropiada',
      'Crea tensión (si aplica)',
      'Sé más auténtico',
    ],
  },
  
  closing: {
    messageRange: [21, 999],
    focus: 'Cerrar con impacto',
    tips: [
      'Deja una impresión memorable',
      'No te quedes demasiado tiempo',
      'Cierra en un punto alto',
      'Deja intriga para próxima vez',
    ],
  },
}

export function getStageAdvice(messageCount: number): string {
  for (const [stage, data] of Object.entries(CONVERSATION_STAGES)) {
    const [min, max] = data.messageRange
    if (messageCount >= min && messageCount <= max) {
      return `ETAPA: ${data.focus}
CONSEJOS:
${data.tips.map(tip => `- ${tip}`).join('\n')}`
    }
  }
  return ''
}
