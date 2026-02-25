'use client'

import { useEffect, useRef, useState } from 'react'

export function usePomodoro() {
    const [timeLeft, setTimeLeft] = useState(25 * 60)
    const [isActive, setIsActive] = useState(false)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            setIsActive(false)
            if (timerRef.current) clearInterval(timerRef.current)
            // Play sound or notify user
            alert('Pomodoro tamamlandı! Mola verin.')
        } else {
            if (timerRef.current) clearInterval(timerRef.current)
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [isActive, timeLeft])

    const startTimer = () => setIsActive(true)
    const pauseTimer = () => setIsActive(false)
    const resetTimer = () => {
        setIsActive(false)
        setTimeLeft(25 * 60)
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 440

    return {
        timeLeft,
        isActive,
        startTimer,
        pauseTimer,
        resetTimer,
        formatTime,
        progress: 440 - progress
    }
}
