"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"

// Dados dos stories
const storiesData = [
  {
    id: 1,
    image: "/images/story-slide-1.jpg",
    text: "Você está em uma encruzilhada...",
    subtext: "E cada passo importa.",
    duration: 5000
  },
  {
    id: 2,
    image: "/images/story-slide-2.jpg",
    text: "É hora de soltar...",
    subtext: "O que não te pertence mais.",
    duration: 5000
  },
  {
    id: 3,
    image: "/images/story-slide-3.jpg",
    text: "Existe uma porta...",
    subtext: "Esperando você atravessar.",
    duration: 5000
  },
  {
    id: 4,
    image: "/images/story-slide-4.jpg",
    text: "A paz que você busca...",
    subtext: "Já existe dentro de você.",
    duration: 5000
  },
  {
    id: 5,
    image: "/images/story-slide-5.jpg",
    text: "Eu estou aqui...",
    subtext: "Para te guiar nessa jornada.",
    duration: 5000,
    isFinal: true
  }
]

// Avatar do Zelador da Alma
function ZeladorAvatar({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14"
  }
  
  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-[2px] flex-shrink-0`}>
      <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 100 120" className="w-[70%] h-[70%]">
          <defs>
            <radialGradient id="storyHalo" cx="50%" cy="30%" r="50%">
              <stop offset="0%" stopColor="#FFD700" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="50" cy="25" rx="40" ry="35" fill="url(#storyHalo)" />
          <ellipse cx="50" cy="35" rx="18" ry="20" fill="#E8DCC4" />
          <path d="M25 55 Q50 70 75 55 L80 100 Q50 115 20 100 Z" fill="#1a1a1a" />
          <path d="M40 65 Q50 55 60 65 L58 90 Q50 95 42 90 Z" fill="#2a2a2a" />
        </svg>
      </div>
    </div>
  )
}

export default function Exp3Stories() {
  const router = useRouter()
  const [currentStory, setCurrentStory] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [showCTA, setShowCTA] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [textVisible, setTextVisible] = useState(false)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const holdTimeout = useRef<NodeJS.Timeout | null>(null)

  const currentStoryData = storiesData[currentStory]

  // Navegar para proximo story
  const goToNextStory = useCallback(() => {
    if (currentStory < storiesData.length - 1) {
      setTextVisible(false)
      setTimeout(() => {
        setCurrentStory(prev => prev + 1)
        setProgress(0)
      }, 150)
    } else {
      // Ultimo story - mostrar CTA
      setShowCTA(true)
    }
  }, [currentStory])

  // Navegar para story anterior
  const goToPrevStory = useCallback(() => {
    if (currentStory > 0) {
      setTextVisible(false)
      setTimeout(() => {
        setCurrentStory(prev => prev - 1)
        setProgress(0)
      }, 150)
    }
  }, [currentStory])

  // Controle de progresso automatico
  useEffect(() => {
    if (isPaused || showCTA) return

    const duration = currentStoryData.duration
    const intervalTime = 50
    const increment = (intervalTime / duration) * 100

    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          goToNextStory()
          return 0
        }
        return prev + increment
      })
    }, intervalTime)

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [currentStory, isPaused, showCTA, currentStoryData.duration, goToNextStory])

  // Animacao de texto
  useEffect(() => {
    const timer = setTimeout(() => {
      setTextVisible(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [currentStory])

  // Handlers de touch
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    
    // Hold para pausar
    holdTimeout.current = setTimeout(() => {
      setIsPaused(true)
    }, 200)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (holdTimeout.current) {
      clearTimeout(holdTimeout.current)
    }
    
    if (isPaused) {
      setIsPaused(false)
      return
    }

    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY
    const diffX = touchEndX - touchStartX.current
    const diffY = touchEndY - touchStartY.current

    // Se foi um swipe horizontal significativo
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        goToNextStory()
      } else {
        goToPrevStory()
      }
      return
    }

    // Tap na metade esquerda ou direita
    const screenWidth = window.innerWidth
    if (touchEndX < screenWidth / 3) {
      goToPrevStory()
    } else if (touchEndX > (screenWidth * 2) / 3) {
      goToNextStory()
    }
  }

  // Click handlers para desktop
  const handleClick = (e: React.MouseEvent) => {
    const screenWidth = window.innerWidth
    const clickX = e.clientX

    if (clickX < screenWidth / 3) {
      goToPrevStory()
    } else if (clickX > (screenWidth * 2) / 3) {
      goToNextStory()
    }
  }

  // CTA click
  const handleCTAClick = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      router.push("/exp4-final")
    }, 300)
  }

  // Fechar stories
  const handleClose = () => {
    router.push("/exp2-tiktok")
  }

  return (
    <div 
      className={`fixed inset-0 bg-black transition-opacity duration-300 ${
        isTransitioning ? "opacity-0" : "opacity-100"
      }`}
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif" }}
    >
      {/* Container principal */}
      <div 
        className="relative w-full h-full max-w-[430px] mx-auto overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
      >
        {/* Imagem de fundo */}
        <div className="absolute inset-0">
          <img 
            src={currentStoryData.image}
            alt=""
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isPaused ? "scale-[1.02]" : "scale-100"
            }`}
          />
          {/* Gradientes para legibilidade */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
        </div>

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 pt-2 px-2">
          {/* Barras de progresso */}
          <div className="flex gap-1 mb-3">
            {storiesData.map((story, index) => (
              <div 
                key={story.id}
                className="flex-1 h-[2px] bg-white/30 rounded-full overflow-hidden"
              >
                <div 
                  className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
                  style={{
                    width: index < currentStory 
                      ? "100%" 
                      : index === currentStory 
                        ? `${progress}%` 
                        : "0%"
                  }}
                />
              </div>
            ))}
          </div>

          {/* Info do usuario */}
          <div className="flex items-center justify-between px-2 py-2">
            <div className="flex items-center gap-3">
              <ZeladorAvatar size="md" />
              <div>
                <p className="text-white text-[14px] font-semibold">Zelador da Alma</p>
                <p className="text-white/60 text-[12px]">agora</p>
              </div>
            </div>
            
            {/* Botoes do header */}
            <div className="flex items-center gap-4">
              {/* Pause indicator */}
              {isPaused && (
                <div className="flex items-center gap-1 text-white/80 text-[12px]">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                  <span>Pausado</span>
                </div>
              )}
              
              {/* Fechar */}
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  handleClose()
                }}
                className="p-2 -mr-2"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Conteudo central - Texto */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div 
            className={`text-center px-8 transition-all duration-500 ${
              textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <h2 className="text-white text-[28px] font-bold leading-tight mb-3 drop-shadow-lg">
              {currentStoryData.text}
            </h2>
            <p className="text-white/90 text-[18px] font-medium drop-shadow-md">
              {currentStoryData.subtext}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pb-8 px-4">
          {/* CTA no ultimo story */}
          {showCTA ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleCTAClick()
                }}
                className="w-full py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-bold text-[17px] rounded-xl active:scale-[0.98] transition-transform shadow-lg"
              >
                Iniciar minha jornada
              </button>
              <p className="text-center text-white/50 text-[13px] mt-3">
                +20 XP pela coragem
              </p>
            </div>
          ) : (
            /* Input de resposta (visual) */
            <div className="flex items-center gap-3">
              <div 
                className="flex-1 py-3 px-4 border border-white/30 rounded-full text-white/50 text-[15px]"
                onClick={(e) => e.stopPropagation()}
              >
                Enviar mensagem...
              </div>
              <button 
                className="p-3"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </button>
              <button 
                className="p-3"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Indicadores de navegacao (visual) */}
        <div className="absolute inset-y-0 left-0 w-1/3 z-10" />
        <div className="absolute inset-y-0 right-0 w-1/3 z-10" />
      </div>

      {/* Styles */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}
