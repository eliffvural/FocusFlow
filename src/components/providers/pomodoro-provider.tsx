'use client'

import { TaskWithCategory } from '@/hooks/use-tasks'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

interface PomodoroContextType {
    timeLeft: number
    isActive: boolean
    activeTask: TaskWithCategory | null
    startTimer: (task?: TaskWithCategory) => void
    pauseTimer: () => void
    resetTimer: () => void
    formatTime: (seconds: number) => string
    progress: number
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined)

export function PomodoroProvider({ children }: { children: React.ReactNode }) {
    const [timeLeft, setTimeLeft] = useState(25 * 60)
    const [isActive, setIsActive] = useState(false)
    const [activeTask, setActiveTask] = useState<TaskWithCategory | null>(null)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            setIsActive(false)
            if (timerRef.current) clearInterval(timerRef.current)
            alert(`${activeTask ? activeTask.title : 'Pomodoro'} tamamlandı! Mola verin.`)
        } else {
            if (timerRef.current) clearInterval(timerRef.current)
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [isActive, timeLeft, activeTask])

    const startTimer = (task?: TaskWithCategory) => {
        if (task) {
            setActiveTask(task)
            setTimeLeft(25 * 60) // Yeni bir göreve tıklandığında süreyi sıfırla
        }
        setIsActive(true)
    }

    const pauseTimer = () => setIsActive(false)

    const resetTimer = () => {
        setIsActive(false)
        setTimeLeft(25 * 60)
        setActiveTask(null)
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const progress = 440 - (((25 * 60 - timeLeft) / (25 * 60)) * 440)

    return (
        <PomodoroContext.Provider value={{
            timeLeft,
            isActive,
            activeTask,
            startTimer,
            pauseTimer,
            resetTimer,
            formatTime,
            progress
        }}>
            {children}
        </PomodoroContext.Provider>
    )
}

export function usePomodoroContext() {
    const context = useContext(PomodoroContext)
    if (context === undefined) {
        throw new Error('usePomodoroContext must be used within a PomodoroProvider')
    }
    return context
}
