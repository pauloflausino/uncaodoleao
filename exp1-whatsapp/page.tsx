"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Phone, Video, MoreVertical } from "lucide-react"

interface Message {
  id: number
  text: string
  sender: "mentor"
  timestamp: string
  status: "delivered" | "read"
}

interface MessageStep {
  text: string
  status: "delivered" | "read"
  delay: number
  typingBefore?: number
}

const messageSequence: MessageStep[] = [
  { text: "posso te fazer uma pergunta meio estranha?", status: "delivered", delay: 0 },
  { text: "é rápido", status: "delivered", delay: 1000 },
  { text: "vc ainda sente Deus como antes?", status: "read", delay: 2000 },
  { text: "tipo...", status: "delivered", delay: 3000 },
  { text: "quando vc orava e parecia q tinha presença mesmo", status: "delivered", delay: 1000 },
  { text: "ou agr virou meio automático?", status: "read", delay: 2000 },
  { text: "não responde rápido não", status: "delivered", delay: 3000, typingBefore: 3000 },
  { text: "sente primeiro", status: "delivered", delay: 1000 },
  { text: "pq tem gente q continua indo pra igreja", status: "delivered", delay: 4000 },
  { text: "continua servindo", status: "delivered", delay: 1000 },
  { text: "continua orando...", status: "delivered", delay: 1000 },
  { text: "mas por dentro...", status: "delivered", delay: 2000 },
  { text: "tá cansado", status: "read", delay: 3000 },
  { text: "mente não para", status: "delivered", delay: 3000 },
  { text: "oração não aprofunda", status: "delivered", delay: 1000 },
  { text: "e começa a bater uma culpa estranha...", status: "delivered", delay: 1000 },
  { text: "tipo", status: "delivered", delay: 2000 },
  { text: "'o que aconteceu comigo?'", status: "read", delay: 1000 },
  { text: "deixa eu te falar uma coisa q quase ngm fala...", status: "delivered", delay: 4000, typingBefore: 4000 },
  { text: "isso tem nome", status: "delivered", delay: 2000 },
  { text: "alma sobrecarregada", status: "read", delay: 2000 },
  { text: "não é falta de fé", status: "delivered", delay: 4000 },
  { text: "é excesso...", status: "delivered", delay: 1000 },
  { text: "coisas não resolvidas", status: "delivered", delay: 3000 },
  { text: "ruído o tempo todo", status: "delivered", delay: 1000 },
  { text: "e uma vida espiritual no automático", status: "delivered", delay: 1000 },
  { text: "me responde com sinceridade...", status: "delivered", delay: 4000 },
  { text: "vc tá cansado de tentar sentir Deus e não conseguir?", status: "read", delay: 2000 },
]

function CheckMark({ status }: { status: "delivered" | "read" }) {
  const color = status === "read" ? "#34B7F1" : "#667781"
  return (
    <svg width="16" height="11" viewBox="0 0 16 11" fill="none" className="ml-1 inline-block flex-shrink-0">
      <path
        d="M11.071 0.929L4.5 7.5L1.929 4.929"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.071 0.929L7.5 7.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-[#667781] rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 bg-[#667781] rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 bg-[#667781] rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  )
}

function MentorAvatar() {
  return (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
      <svg viewBox="0 0 36 36" className="w-full h-full">
        {/* Fundo com luz suave */}
        <defs>
          <radialGradient id="lightGlow" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#FEF3C7" />
            <stop offset="100%" stopColor="#FDE68A" />
          </radialGradient>
        </defs>
        <circle cx="18" cy="18" r="18" fill="url(#lightGlow)" />
        {/* Silhueta em oração */}
        <ellipse cx="18" cy="12" rx="5" ry="6" fill="#92400E" opacity="0.7" />
        <path
          d="M12 20 Q18 18 24 20 L24 28 Q18 30 12 28 Z"
          fill="#92400E"
          opacity="0.7"
        />
        {/* Mãos em oração */}
        <path
          d="M16 22 L18 19 L20 22"
          stroke="#92400E"
          strokeWidth="1.5"
          fill="none"
          opacity="0.8"
        />
        {/* Raios de luz */}
        <g stroke="#F59E0B" strokeWidth="0.5" opacity="0.4">
          <line x1="18" y1="4" x2="18" y2="7" />
          <line x1="10" y1="6" x2="12" y2="8" />
          <line x1="26" y1="6" x2="24" y2="8" />
        </g>
      </svg>
    </div>
  )
}

export default function Exp1WhatsApp() {
  const router = useRouter()
  const [showNotification, setShowNotification] = useState(true)
  const [notificationExiting, setNotificationExiting] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showCTA, setShowCTA] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleAccept = () => {
    setNotificationExiting(true)
    setTimeout(() => {
      setShowNotification(false)
    }, 300)
  }

  const handleReject = () => {
    // Volta para a página inicial ou exibe mensagem
    router.push("/")
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    // Não inicia mensagens enquanto a notificação está visível
    if (showNotification) return

    if (currentStep >= messageSequence.length) {
      setTimeout(() => setShowCTA(true), 1000)
      return
    }

    const step = messageSequence[currentStep]

    const processStep = async () => {
      // Delay inicial
      await new Promise((r) => setTimeout(r, step.delay))

      // Mostrar "Digitando..." se necessário
      if (step.typingBefore) {
        setIsTyping(true)
        await new Promise((r) => setTimeout(r, step.typingBefore))
        setIsTyping(false)
      }

      // Adicionar mensagem
      const newMsg: Message = {
        id: Date.now(),
        text: step.text,
        sender: "mentor",
        timestamp: "Agora",
        status: step.status,
      }
      setMessages((prev) => [...prev, newMsg])
      setCurrentStep((prev) => prev + 1)
    }

    processStep()
  }, [currentStep, showNotification])

  const handleCTAClick = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      router.push("/exp2-tiktok")
    }, 300)
  }

  // Tela de notificação inicial
  if (showNotification) {
    return (
      <div 
        className={`min-h-screen bg-black/60 flex items-center justify-center px-4 transition-opacity duration-300 ${
          notificationExiting ? "opacity-0" : "opacity-100"
        }`}
        style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif" }}
      >
        {/* Notification Card estilo iOS */}
        <div className="w-full max-w-[340px] bg-white/95 backdrop-blur-xl rounded-[20px] overflow-hidden shadow-2xl animate-in zoom-in-95 fade-in duration-300">
          {/* Header da notificação */}
          <div className="px-4 pt-4 pb-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.789l4.89-1.56A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.137 0-4.146-.659-5.804-1.786l-4.065 1.299 1.325-3.963A9.953 9.953 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-[#1C1C1E] uppercase tracking-wide">WhatsApp</p>
              <p className="text-[12px] text-[#8E8E93]">agora</p>
            </div>
          </div>

          {/* Conteúdo da mensagem */}
          <div className="px-4 pb-4">
            <div className="flex items-center gap-3 mb-3">
              <MentorAvatar />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-[#1C1C1E]">Zelador da Alma</p>
              </div>
            </div>
            <p className="text-[15px] text-[#3C3C43] leading-[1.4]">
              posso te fazer uma pergunta meio estranha?
            </p>
          </div>

          {/* Botões de ação */}
          <div className="border-t border-[#E5E5EA] flex">
            <button
              onClick={handleReject}
              className="flex-1 py-3.5 text-[17px] font-normal text-[#007AFF] border-r border-[#E5E5EA] active:bg-[#E5E5EA]/50 transition-colors"
            >
              Ignorar
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 py-3.5 text-[17px] font-semibold text-[#007AFF] active:bg-[#E5E5EA]/50 transition-colors"
            >
              Responder
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`max-w-[100vw] overflow-x-hidden h-screen flex flex-col bg-white transition-opacity duration-300 ${
        isTransitioning ? "opacity-0" : "opacity-100"
      }`}
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif" }}
    >
      {/* Header WhatsApp iOS 17 */}
      <header className="h-[60px] bg-[#075E54] flex items-center px-4 gap-3 flex-shrink-0">
        <button className="text-white p-1 -ml-1" aria-label="Voltar">
          <ChevronLeft size={24} />
        </button>
        
        <MentorAvatar />
        
        <div className="flex-1 min-w-0">
          <h1 className="text-[17px] font-semibold text-white truncate">
            Zelador da Alma
          </h1>
          <p className="text-[13px] text-white/80">Online</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="text-white" aria-label="Chamada de vídeo">
            <Video size={24} />
          </button>
          <button className="text-white" aria-label="Chamada de voz">
            <Phone size={24} />
          </button>
          <button className="text-white" aria-label="Mais opções">
            <MoreVertical size={24} />
          </button>
        </div>
      </header>

      {/* Área de mensagens */}
      <main className="flex-1 overflow-y-auto bg-[#ECE5DD] px-4 py-4 sm:px-6">
        <div className="max-w-2xl mx-auto space-y-2">
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-200"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className="bg-white rounded-[18px] px-3 py-2 max-w-[82%] shadow-sm border border-[#E5E5EA]"
                style={{ wordBreak: "break-word", hyphens: "auto" }}
              >
                <p className="text-[16px] text-black leading-[1.4]">{msg.text}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-[12px] text-[#667781]">{msg.timestamp}</span>
                  <CheckMark status={msg.status} />
                </div>
              </div>
            </div>
          ))}

          {/* Indicador de digitação */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white rounded-[18px] shadow-sm border border-[#E5E5EA] min-h-[44px] flex items-center">
                <TypingIndicator />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* CTA Final */}
      {showCTA && (
        <div className="p-4 bg-white border-t border-[#E5E5EA] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <button
            onClick={handleCTAClick}
            className="w-full min-h-[44px] bg-[#075E54] text-white rounded-xl font-semibold text-[16px] hover:bg-[#064E46] active:scale-[0.98] transition-all duration-150"
          >
            Assistir a revelação
          </button>
          <p className="text-center text-[13px] text-[#667781] mt-2">
            +10 XP (Diagnóstico desbloqueado)
          </p>
        </div>
      )}
    </div>
  )
}
