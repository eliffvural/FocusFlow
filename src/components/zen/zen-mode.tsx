'use client'

import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { Minimize2, Moon, Mountain, Music, Palette } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ZenModeProps {
    taskTitle: string
    minutes: number
    seconds: number
    isActive: boolean
    onClose: () => void
    formatTime: (totalSeconds: number) => string
    progress: number
}

const BACKGROUNDS = [
    { id: 'lofi', name: 'Lofi Oda', url: '/images/zen/lofi.png', icon: Moon },
    { id: 'nature', name: 'Sisli Orman', url: '/images/zen/nature.png', icon: Mountain },
    { id: 'abstract', name: 'Soyut Gece', url: '/images/zen/abstract.png', icon: Palette },
]

export function ZenMode({ taskTitle, seconds, onClose, formatTime, progress }: ZenModeProps) {
    const [currentBg, setCurrentBg] = useState(BACKGROUNDS[0])
    const [isControlsVisible, setIsControlsVisible] = useState(true)

    // Fare hareketsiz kaldığında kontrolleri gizle
    useEffect(() => {
        let timeout: NodeJS.Timeout
        const handleMouseMove = () => {
            setIsControlsVisible(true)
            clearTimeout(timeout)
            timeout = setTimeout(() => setIsControlsVisible(false), 3000)
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black overflow-hidden"
        >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <motion.img
                    key={currentBg.id}
                    src={currentBg.url}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 0.6, scale: 1 }}
                    transition={{ duration: 1.5 }}
                    className="w-full h-full object-cover"
                    alt="Zen Background"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 backdrop-blur-[2px]" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center justify-center space-y-12 text-center px-6 max-w-4xl w-full">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                >
                    <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white/70 border border-white/10">
                        Derin Odaklanma Modu
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-2xl">
                        {taskTitle}
                    </h1>
                </motion.div>

                {/* Big Timer */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="relative group"
                >
                    <div className="text-8xl md:text-[12rem] font-black text-white tabular-nums tracking-tighter drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                        {formatTime(seconds)}
                    </div>

                    {/* Progress Bar (Hidden or Minimal) */}
                    <div className="absolute -bottom-4 left-0 right-0 h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-white/40"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                        />
                    </div>
                </motion.div>
            </div>

            {/* Floating Controls */}
            <AnimatePresence>
                {isControlsVisible && (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        className="fixed bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 px-6 py-3 bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl"
                    >
                        {/* Background Switcher */}
                        <div className="flex items-center gap-2 border-r border-white/10 pr-4 mr-2">
                            {BACKGROUNDS.map((bg) => {
                                const Icon = bg.icon
                                return (
                                    <button
                                        key={bg.id}
                                        onClick={() => setCurrentBg(bg)}
                                        className={cn(
                                            "p-2.5 rounded-xl transition-all hover:bg-white/10",
                                            currentBg.id === bg.id ? "text-white bg-white/20" : "text-white/40"
                                        )}
                                        title={bg.name}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </button>
                                )
                            })}
                        </div>

                        {/* Exit Button */}
                        <button
                            onClick={onClose}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/90 transition-all active:scale-95 shadow-xl"
                        >
                            <Minimize2 className="w-4 h-4" />
                            Odaklanmayı Bitir
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Subtle Sound Settings (Placeholder/Future) */}
            <div className="fixed top-8 right-8 z-20 opacity-40 hover:opacity-100 transition-opacity">
                <button className="p-3 text-white">
                    <Music className="w-6 h-6" />
                </button>
            </div>
        </motion.div>
    )
}
