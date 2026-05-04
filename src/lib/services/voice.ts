// Servicio de voz con configuraciones avanzadas

export class VoiceService {
  private audioContext: AudioContext | null = null
  private mediaRecorder: MediaRecorder | null = null
  private audioChunks: Blob[] = []

  // Inicializar contexto de audio
  private initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return this.audioContext
  }

  // Grabar audio con configuración optimizada
  async startRecording(): Promise<MediaRecorder> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000, // Óptimo para Whisper
        },
      })

      // Detectar formato soportado
      const mimeType = this.getSupportedMimeType()
      
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000,
      })

      this.audioChunks = []

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data)
        }
      }

      this.mediaRecorder.start(100) // Capturar cada 100ms
      return this.mediaRecorder
    } catch (error) {
      console.error('Error starting recording:', error)
      throw new Error('No se pudo acceder al micrófono')
    }
  }

  // Detener grabación y obtener blob
  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No hay grabación activa'))
        return
      }

      this.mediaRecorder.onstop = () => {
        const mimeType = this.getSupportedMimeType()
        const audioBlob = new Blob(this.audioChunks, { type: mimeType })
        
        // Detener todos los tracks
        this.mediaRecorder?.stream.getTracks().forEach(track => track.stop())
        
        resolve(audioBlob)
      }

      this.mediaRecorder.stop()
    })
  }

  // Obtener tipo MIME soportado
  private getSupportedMimeType(): string {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
    ]

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type
      }
    }

    return 'audio/webm' // Fallback
  }

  // Convertir blob a formato compatible con Whisper
  async convertToWhisperFormat(audioBlob: Blob): Promise<File> {
    // Whisper acepta: mp3, mp4, mpeg, mpga, m4a, wav, webm
    const file = new File([audioBlob], 'recording.webm', {
      type: audioBlob.type,
    })
    return file
  }

  // Reproducir audio con control de volumen
  async playAudio(audioBlob: Blob, volume: number = 1.0): Promise<void> {
    return new Promise((resolve, reject) => {
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audio.volume = Math.max(0, Math.min(1, volume))

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl)
        resolve()
      }

      audio.onerror = (error) => {
        URL.revokeObjectURL(audioUrl)
        reject(error)
      }

      audio.play().catch(reject)
    })
  }

  // Obtener duración del audio
  async getAudioDuration(audioBlob: Blob): Promise<number> {
    return new Promise((resolve, reject) => {
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)

      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(audioUrl)
        resolve(audio.duration)
      }

      audio.onerror = (error) => {
        URL.revokeObjectURL(audioUrl)
        reject(error)
      }
    })
  }

  // Visualizar forma de onda (opcional)
  async visualizeWaveform(
    audioBlob: Blob,
    canvas: HTMLCanvasElement
  ): Promise<void> {
    const context = this.initAudioContext()
    const arrayBuffer = await audioBlob.arrayBuffer()
    const audioBuffer = await context.decodeAudioData(arrayBuffer)

    const canvasContext = canvas.getContext('2d')
    if (!canvasContext) return

    const data = audioBuffer.getChannelData(0)
    const step = Math.ceil(data.length / canvas.width)
    const amp = canvas.height / 2

    canvasContext.fillStyle = '#f3f4f6'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)

    canvasContext.strokeStyle = '#8b5cf6'
    canvasContext.lineWidth = 2
    canvasContext.beginPath()

    for (let i = 0; i < canvas.width; i++) {
      const min = Math.min(...Array.from(data.slice(i * step, (i + 1) * step)))
      const max = Math.max(...Array.from(data.slice(i * step, (i + 1) * step)))
      
      canvasContext.moveTo(i, (1 + min) * amp)
      canvasContext.lineTo(i, (1 + max) * amp)
    }

    canvasContext.stroke()
  }

  // Verificar permisos de micrófono
  async checkMicrophonePermission(): Promise<boolean> {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName })
      return result.state === 'granted'
    } catch {
      // Fallback: intentar acceder directamente
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        stream.getTracks().forEach(track => track.stop())
        return true
      } catch {
        return false
      }
    }
  }

  // Limpiar recursos
  cleanup() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop()
    }
    if (this.audioContext) {
      this.audioContext.close()
    }
  }
}

export const voiceService = new VoiceService()

// Configuraciones de voz para diferentes personalidades
export const VOICE_CONFIGS = {
  friendly: {
    voice: 'nova' as const,
    speed: 1.0,
    pitch: 1.0,
  },
  flirty: {
    voice: 'shimmer' as const,
    speed: 0.95,
    pitch: 1.05,
  },
  challenging: {
    voice: 'alloy' as const,
    speed: 1.05,
    pitch: 0.95,
  },
  shy: {
    voice: 'nova' as const,
    speed: 0.9,
    pitch: 1.1,
  },
  confident: {
    voice: 'fable' as const,
    speed: 1.0,
    pitch: 1.0,
  },
}

export function getVoiceForPersonality(personality: string) {
  return VOICE_CONFIGS[personality as keyof typeof VOICE_CONFIGS] || VOICE_CONFIGS.friendly
}

// Utilidades para procesamiento de audio
export class AudioProcessor {
  // Reducir ruido de fondo (básico)
  static async reduceNoise(audioBlob: Blob): Promise<Blob> {
    // TODO: Implementar reducción de ruido con Web Audio API
    // Por ahora, retornar el blob original
    return audioBlob
  }

  // Normalizar volumen
  static async normalizeVolume(audioBlob: Blob): Promise<Blob> {
    // TODO: Implementar normalización de volumen
    return audioBlob
  }

  // Comprimir audio
  static async compressAudio(audioBlob: Blob, quality: number = 0.7): Promise<Blob> {
    // TODO: Implementar compresión
    return audioBlob
  }
}
