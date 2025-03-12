"use client"

import { useState } from "react"
import { Play, Volume2, Share2, Heart } from "lucide-react"

export function RadioPlayer() {
  const [volume, setVolume] = useState(80)

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-black text-white z-50 flex items-center px-4 shadow-lg">
      {/* Left section - Logo and station info */}
      <div className="flex items-center gap-3">
        <img src="/placeholder.svg?height=32&width=32" alt="Cherie FM" className="h-8 w-8" />
        <div>
          <div className="text-sm font-medium">CHERIE FM</div>
          <div className="text-xs text-gray-400">Feel Good Music !</div>
        </div>
      </div>

      {/* Center section - Play controls */}
      <div className="flex-1 flex justify-center items-center gap-4">
        <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-colors">
          <Play size={20} className="ml-1" />
        </button>
      </div>

      {/* Right section - Volume and additional controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Volume2 size={20} />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-24 accent-white"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="hover:text-gray-300 transition-colors">
            <Share2 size={20} />
          </button>
          <button className="hover:text-gray-300 transition-colors">
            <Heart size={20} />
          </button>
          <span className="text-xs font-medium px-1.5 py-0.5 bg-white/10 rounded">HD</span>
          <button className="ml-2 px-3 py-1.5 text-sm border border-white/20 rounded-md hover:bg-white/10 transition-colors">
            <span className="hidden sm:inline">Plus de </span>Radios
          </button>
        </div>
      </div>
    </div>
  )
}

