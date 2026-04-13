"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Heart, MessageCircle, Share2, Music2, Pause, Play, Volume2, VolumeX, X, Send, ChevronLeft, ChevronRight } from "lucide-react"

// Slides do carrossel com imagens reais
const carouselSlides = [
  {
    id: 1,
    type: "image",
    image: "/images/tiktok-slide-1.jpg",
    text: "Você chegou até aqui...",
    subtext: "E isso já diz muito sobre você."
  },
  {
    id: 2,
    type: "image",
    image: "/images/tiktok-slide-2.jpg",
    text: "A alma sobrecarregada...",
    subtext: "não é fraqueza. É um sinal."
  },
  {
    id: 3,
    type: "image",
    image: "/images/tiktok-slide-3.jpg",
    text: "De que você precisa de espaço...",
    subtext: "pra respirar de novo."
  },
  {
    id: 4,
    type: "image",
    image: "/images/tiktok-slide-4.jpg",
    text: "Eu vou te mostrar como.",
    subtext: "Mas primeiro... preciso que você veja algo."
  }
]

// Comentarios iniciais
const initialComments = [
  { id: 1, user: "maria_luz", avatar: "ML", text: "isso tocou meu coracao", time: "2h", likes: 234 },
  { id: 2, user: "joao.silva", avatar: "JS", text: "precisava ouvir isso hoje", time: "1h", likes: 189 },
  { id: 3, user: "ana_costa", avatar: "AC", text: "compartilhei com minha mae", time: "45m", likes: 156 },
  { id: 4, user: "pedro_santos", avatar: "PS", text: "que mensagem poderosa", time: "30m", likes: 98 },
  { id: 5, user: "julia.oliveira", avatar: "JO", text: "voce mudou minha perspectiva", time: "15m", likes: 67 },
]

interface Comment {
  id: number
  user: string
  avatar: string
  text: string
  time: string
  likes: number
  isLiked?: boolean
}

export default function Exp2TikTok() {
  const router = useRouter()
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [progress, setProgress] = useState(0)
  const [showCTA, setShowCTA] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [likes, setLikes] = useState(12847)
  const [isLiked, setIsLiked] = useState(false)
  const [showHeart, setShowHeart] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState("")
  const startTimeRef = useRef<number>(Date.now())
  const animationRef = useRef<number | null>(null)
  const lastTapRef = useRef<number>(0)
  const commentsEndRef = useRef<HTMLDivElement>(null)

  const SLIDE_DURATION = 5000 // 5 segundos por slide
  const TOTAL_DURATION = carouselSlides.length * SLIDE_DURATION

  useEffect(() => {
    if (!isPlaying || showComments) return

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current
      const newProgress = Math.min(elapsed / TOTAL_DURATION, 1)
      setProgress(newProgress)

      // Atualiza slide atual
      const newSlide = Math.min(
        Math.floor(elapsed / SLIDE_DURATION),
        carouselSlides.length - 1
      )
      setCurrentSlide(newSlide)

      // Mostra CTA no final
      if (elapsed >= TOTAL_DURATION - 1000 && !showCTA) {
        setShowCTA(true)
      }

      if (newProgress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, showComments, showCTA])

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    } else {
      const elapsed = progress * TOTAL_DURATION
      startTimeRef.current = Date.now() - elapsed
      setIsPlaying(true)
    }
  }

  const handleDoubleTap = () => {
    const now = Date.now()
    if (now - lastTapRef.current < 300) {
      if (!isLiked) {
        setIsLiked(true)
        setLikes(prev => prev + 1)
        setShowHeart(true)
        setTimeout(() => setShowHeart(false), 1000)
      }
    } else {
      togglePlay()
    }
    lastTapRef.current = now
  }

  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false)
      setLikes(prev => prev - 1)
    } else {
      setIsLiked(true)
      setLikes(prev => prev + 1)
      setShowHeart(true)
      setTimeout(() => setShowHeart(false), 800)
    }
  }

  const handleCommentLike = (commentId: number) => {
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          likes: c.isLiked ? c.likes - 1 : c.likes + 1,
          isLiked: !c.isLiked
        }
      }
      return c
    }))
  }

  const handleSendComment = () => {
    if (!newComment.trim()) return
    
    const comment: Comment = {
      id: Date.now(),
      user: "voce",
      avatar: "VC",
      text: newComment.trim(),
      time: "agora",
      likes: 0,
      isLiked: false
    }
    
    setComments(prev => [...prev, comment])
    setNewComment("")
    
    setTimeout(() => {
      commentsEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const goToSlide = (direction: "prev" | "next") => {
    if (direction === "prev" && currentSlide > 0) {
      const newSlide = currentSlide - 1
      setCurrentSlide(newSlide)
      startTimeRef.current = Date.now() - (newSlide * SLIDE_DURATION)
      setProgress((newSlide * SLIDE_DURATION) / TOTAL_DURATION)
    } else if (direction === "next" && currentSlide < carouselSlides.length - 1) {
      const newSlide = currentSlide + 1
      setCurrentSlide(newSlide)
      startTimeRef.current = Date.now() - (newSlide * SLIDE_DURATION)
      setProgress((newSlide * SLIDE_DURATION) / TOTAL_DURATION)
    }
  }

  const handleCTAClick = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      router.push("/exp3-stories")
    }, 300)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  const openComments = () => {
    setShowComments(true)
    setIsPlaying(false)
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }

  const closeComments = () => {
    setShowComments(false)
    const elapsed = progress * TOTAL_DURATION
    startTimeRef.current = Date.now() - elapsed
    setIsPlaying(true)
  }

  const currentSlideData = carouselSlides[currentSlide]

  return (
    <div 
      className={`fixed inset-0 bg-black flex flex-col transition-opacity duration-300 ${
        isTransitioning ? "opacity-0" : "opacity-100"
      }`}
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif" }}
    >
      {/* Barras de progresso por slide */}
      <div className="absolute top-0 left-0 right-0 z-20 p-2 flex gap-1">
        {carouselSlides.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-100"
              style={{ 
                width: index < currentSlide 
                  ? "100%" 
                  : index === currentSlide 
                    ? `${((progress * TOTAL_DURATION) - (index * SLIDE_DURATION)) / SLIDE_DURATION * 100}%`
                    : "0%"
              }}
            />
          </div>
        ))}
      </div>

      {/* Area do carrossel - clicavel */}
      <div 
        className="flex-1 relative overflow-hidden"
        onClick={handleDoubleTap}
      >
        {/* Background com imagem real */}
        <div className="absolute inset-0 transition-all duration-700">
          {/* Imagem de fundo */}
          <img 
            src={currentSlideData.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay escuro para legibilidade do texto */}
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Efeito de luz pulsante */}
          <div 
            className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full transition-opacity duration-1000 ${
              isPlaying ? "opacity-20" : "opacity-5"
            }`}
            style={{
              background: "radial-gradient(circle, rgba(255,215,0,0.4) 0%, rgba(255,215,0,0) 70%)",
              animation: isPlaying ? "pulse 4s ease-in-out infinite" : "none"
            }}
          />
        </div>

        {/* Texto do slide */}
        <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 px-6 text-center z-10">
          <p 
            className="text-white text-2xl font-bold leading-tight mb-3 transition-opacity duration-500"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
          >
            {currentSlideData.text}
          </p>
          <p 
            className="text-white/80 text-lg transition-opacity duration-500"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}
          >
            {currentSlideData.subtext}
          </p>
        </div>

        {/* Navegacao do carrossel */}
        <button 
          onClick={(e) => { e.stopPropagation(); goToSlide("prev"); }}
          className={`absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center z-10 ${
            currentSlide === 0 ? "opacity-30" : "opacity-80"
          }`}
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); goToSlide("next"); }}
          className={`absolute right-14 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center z-10 ${
            currentSlide === carouselSlides.length - 1 ? "opacity-30" : "opacity-80"
          }`}
          disabled={currentSlide === carouselSlides.length - 1}
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Heart animation on double tap */}
        {showHeart && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <Heart className="w-24 h-24 text-red-500 fill-red-500 animate-in zoom-in-50 fade-in duration-300" />
          </div>
        )}

        {/* Pause indicator */}
        {!isPlaying && !showComments && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
              <Play className="w-10 h-10 text-white fill-white ml-1" />
            </div>
          </div>
        )}

        {/* Indicadores de slide */}
        <div className="absolute bottom-36 left-0 right-0 flex justify-center gap-2 z-10">
          {carouselSlides.map((_, index) => (
            <div 
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-white w-6" : "bg-white/40"
              }`}
            />
          ))}
        </div>

        {/* Informacoes do criador */}
        <div className="absolute bottom-20 left-4 right-20 z-10">
          <div className="flex items-center gap-3 mb-2">
            {/* Foto de perfil real */}
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white/30">
              <div className="w-full h-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-full h-full">
                  <defs>
                    <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#EA580C" />
                    </linearGradient>
                  </defs>
                  <rect fill="url(#avatarGrad)" width="40" height="40"/>
                  {/* Silhueta de rosto */}
                  <ellipse cx="20" cy="15" rx="8" ry="9" fill="#1a1a1a" opacity="0.7"/>
                  <ellipse cx="20" cy="32" rx="12" ry="10" fill="#1a1a1a" opacity="0.7"/>
                  {/* Halo de luz */}
                  <circle cx="20" cy="12" r="12" fill="rgba(255,215,0,0.3)"/>
                </svg>
              </div>
            </div>
            <div>
              <p className="text-white font-semibold text-[15px]">@zelador.da.alma</p>
              <p className="text-white/60 text-[13px]">Zelador da Alma</p>
            </div>
            <button className="ml-2 px-4 py-1.5 bg-red-500 rounded-md text-white text-[13px] font-semibold">
              Seguir
            </button>
          </div>
          
          {/* Musica */}
          <div className="flex items-center gap-2">
            <Music2 className="w-4 h-4 text-white" />
            <div className="flex-1 overflow-hidden">
              <p className="text-white/80 text-[13px] whitespace-nowrap">
                Som original - Zelador da Alma
              </p>
            </div>
          </div>
        </div>

        {/* Botoes laterais */}
        <div className="absolute right-3 bottom-32 flex flex-col items-center gap-5 z-10">
          {/* Foto de perfil com disco girando */}
          <div className="relative mb-2">
            <div className={`w-12 h-12 rounded-full border-2 border-white overflow-hidden ${isPlaying ? "animate-spin-slow" : ""}`}>
              <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-600">
                <svg viewBox="0 0 48 48" className="w-full h-full">
                  <defs>
                    <linearGradient id="discGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#EA580C" />
                    </linearGradient>
                  </defs>
                  <rect fill="url(#discGrad)" width="48" height="48"/>
                  <ellipse cx="24" cy="18" rx="9" ry="10" fill="#1a1a1a" opacity="0.6"/>
                  <ellipse cx="24" cy="38" rx="14" ry="12" fill="#1a1a1a" opacity="0.6"/>
                  <circle cx="24" cy="14" r="14" fill="rgba(255,215,0,0.25)"/>
                </svg>
              </div>
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border border-white">
              <span className="text-white text-[10px] font-bold">+</span>
            </div>
          </div>

          {/* Like */}
          <button 
            onClick={(e) => { e.stopPropagation(); handleLike(); }}
            className="flex flex-col items-center"
          >
            <div className={`w-12 h-12 rounded-full bg-white/10 flex items-center justify-center transition-transform active:scale-90 ${
              isLiked ? "animate-in zoom-in-50 duration-200" : ""
            }`}>
              <Heart className={`w-7 h-7 transition-colors ${isLiked ? "text-red-500 fill-red-500" : "text-white"}`} />
            </div>
            <span className="text-white text-xs mt-1 font-medium">{formatNumber(likes)}</span>
          </button>

          {/* Comentarios */}
          <button 
            onClick={(e) => { e.stopPropagation(); openComments(); }}
            className="flex flex-col items-center"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <span className="text-white text-xs mt-1 font-medium">{comments.length}</span>
          </button>

          {/* Compartilhar */}
          <button className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <Share2 className="w-7 h-7 text-white" />
            </div>
            <span className="text-white text-xs mt-1 font-medium">Share</span>
          </button>

          {/* Mute/Unmute */}
          <button 
            onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
            className="flex flex-col items-center"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              {isMuted ? <VolumeX className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />}
            </div>
          </button>
        </div>
      </div>

      {/* CTA Final */}
      {showCTA && !showComments && (
        <div className="absolute bottom-4 left-4 right-4 z-30 animate-in slide-in-from-bottom-4 fade-in duration-500">
          <button
            onClick={handleCTAClick}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-[17px] rounded-xl active:scale-[0.98] transition-transform shadow-lg shadow-orange-500/30"
          >
            Ver a Prova
          </button>
          <p className="text-center text-white/50 text-[13px] mt-2">
            +15 XP (Revelacao desbloqueada)
          </p>
        </div>
      )}

      {/* Modal de Comentarios */}
      {showComments && (
        <div 
          className="absolute inset-0 z-40 flex flex-col"
          onClick={closeComments}
        >
          {/* Overlay escuro */}
          <div className="flex-1 bg-black/60" />
          
          {/* Painel de comentarios */}
          <div 
            className="bg-[#121212] rounded-t-2xl max-h-[70vh] flex flex-col animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <span className="text-white font-semibold">{comments.length} comentarios</span>
              <button onClick={closeComments} className="p-1">
                <X className="w-6 h-6 text-white/60" />
              </button>
            </div>

            {/* Lista de comentarios */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-semibold">{comment.avatar}</span>
                  </div>
                  
                  {/* Conteudo */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white/60 text-[13px] font-medium">@{comment.user}</span>
                      <span className="text-white/40 text-[11px]">{comment.time}</span>
                    </div>
                    <p className="text-white text-[14px] mt-0.5 break-words">{comment.text}</p>
                    <div className="flex items-center gap-4 mt-1.5">
                      <button 
                        onClick={() => handleCommentLike(comment.id)}
                        className="flex items-center gap-1 text-white/50 text-[12px]"
                      >
                        <Heart className={`w-4 h-4 ${comment.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                        <span>{comment.likes}</span>
                      </button>
                      <button className="text-white/50 text-[12px]">Responder</button>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={commentsEndRef} />
            </div>

            {/* Input de comentario */}
            <div className="px-4 py-3 border-t border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-semibold">VC</span>
              </div>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
                placeholder="Adicione um comentario..."
                className="flex-1 bg-white/10 text-white text-[14px] rounded-full px-4 py-2.5 placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/20"
              />
              <button 
                onClick={handleSendComment}
                className={`p-2 rounded-full transition-colors ${
                  newComment.trim() ? "bg-red-500 text-white" : "bg-white/10 text-white/40"
                }`}
                disabled={!newComment.trim()}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estilos para animacoes */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.5; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0.2; }
          50% { transform: translateY(-20px); opacity: 0.5; }
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
