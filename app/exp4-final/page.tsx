"use client"

import { useRouter } from "next/navigation"

export default function Exp4Final() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] to-black flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center animate-pulse">
          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">
          Parabens!
        </h1>
        <p className="text-white/70 mb-2 text-lg">
          Voce completou a jornada inicial.
        </p>
        <p className="text-amber-400 font-semibold mb-8">
          +50 XP ganhos
        </p>
        <button
          onClick={() => router.push("/exp1-whatsapp")}
          className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-white/90 transition-colors"
        >
          Comecar novamente
        </button>
      </div>
    </div>
  )
}
