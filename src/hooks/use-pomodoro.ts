'use client'

import { usePomodoroContext } from '@/components/providers/pomodoro-provider'

export function usePomodoro() {
    return usePomodoroContext()
}
