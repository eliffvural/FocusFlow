'use client'

import { TaskWithCategory } from '@/hooks/use-tasks'
import { cn } from '@/lib/utils'
import { CheckCircle2, Clock, Pause, Play, RotateCcw, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface TaskTimerProps {
    task: TaskWithCategory
    onClose: () => void
}

export function TaskTimer({ task, onClose }: TaskTimerProps) {
    const [seconds, setSeconds] = useState(25 * 60) // Varsayılan 25 dakika (Pomodoro gibi)
    const [isActive, setIsActive] = useState(false)
    const [mode, setMode] = useState<'countdown' | 'timer'>('timer') // İleride geliştirilebilir
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (isActive && seconds > 0) {
            timerRef.current = setInterval(() => {
                setSeconds((prev) => prev - 1)
            }, 1000)
        } else if (seconds === 0) {
            setIsActive(false)
            if (timerRef.current) clearInterval(timerRef.current)
            // Bittiğinde opsiyonel ses veya bildirim eklenebilir
        } else {
            if (timerRef.current) clearInterval(timerRef.current)
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [isActive, seconds])

    const toggleTimer = () => setIsActive(!isActive)

    const resetTimer = () => {
        setIsActive(false)
        setSeconds(25 * 60)
    }

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60)
        const secs = totalSeconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const progress = ((25 * 60 - seconds) / (25 * 60)) * 100

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-xl rounded-[40px] overflow-hidden shadow-2xl border border-slate-100 flex flex-col items-center p-12 relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-8 top-8 p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all active:scale-90"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Task Header */}
                <div className="flex flex-col items-center text-center space-y-4 mb-12">
                    {task.category_id && (
                        <div className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                            {task.categories?.name}
                        </div>
                    )}
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight max-w-md">
                        {task.title}
                    </h2>
                    {task.description && (
                        <p className="text-sm font-medium text-slate-500 max-w-sm line-clamp-2">
                            {task.description}
                        </p>
                    )}
                </div>

                {/* Timer Circle - Visual Representation */}
                <div className="relative w-72 h-72 flex items-center justify-center mb-12">
                    <svg className="w-full h-full -rotate-90 transform">
                        <circle
                            cx="144"
                            cy="144"
                            r="130"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
                            className="text-slate-50"
                        />
                        <circle
                            cx="144"
                            cy="144"
                            r="130"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
                            strokeDasharray={816.8}
                            strokeDashoffset={816.8 - (816.8 * progress) / 100}
                            strokeLinecap="round"
                            className="text-indigo-600 transition-all duration-1000"
                        />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
                        <span className="text-7xl font-black text-slate-900 tabular-nums tracking-tighter">
                            {formatTime(seconds)}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                            <Clock className="w-3 h-3" />
                            {isActive ? 'Odaklanılıyor' : 'Duraklatıldı'}
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-8">
                    <button
                        onClick={resetTimer}
                        className="p-5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all active:scale-90 shadow-sm border border-slate-100"
                        title="Sıfırla"
                    >
                        <RotateCcw className="w-6 h-6" />
                    </button>

                    <button
                        onClick={toggleTimer}
                        className={cn(
                            "w-24 h-24 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-2xl shadow-indigo-200 border-b-4",
                            isActive
                                ? "bg-white border-slate-100 text-indigo-600"
                                : "bg-indigo-600 border-indigo-800 text-white"
                        )}
                    >
                        {isActive ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
                    </button>

                    <button
                        className="p-5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-all active:scale-90 shadow-sm border border-slate-100"
                        title="Tamamla"
                        onClick={() => {
                            // Görevi tamamla ve kapat (onTaskUpdate hook ile entegre edilebilir)
                            onClose()
                        }}
                    >
                        <CheckCircle2 className="w-6 h-6" />
                    </button>
                </div>

                {/* Bottom Tip */}
                <p className="mt-12 text-slate-400 text-xs font-bold uppercase tracking-[0.1em]">
                    FocusFlow ile Verimliliğini Koru
                </p>
            </div>
        </div>
    )
}
