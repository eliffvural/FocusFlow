'use client'

import { TaskWithCategory, useTasks } from '@/hooks/use-tasks'
import { cn } from '@/lib/utils'
import { addDays, format, isSameDay, set, startOfWeek } from 'date-fns'
import { tr } from 'date-fns/locale'

interface CalendarViewProps {
    tasks: TaskWithCategory[]
}

export function CalendarView({ tasks }: CalendarViewProps) {
    const { updateTask } = useTasks()
    const today = new Date()
    const startDate = startOfWeek(today, { weekStartsOn: 1 })
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i))

    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        e.dataTransfer.setData('taskId', taskId)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const handleDrop = (e: React.DragEvent, dropDate: Date) => {
        e.preventDefault()
        const taskId = e.dataTransfer.getData('taskId')
        const task = tasks.find(t => t.id === taskId)

        if (task && task.start_time) {
            const originalDate = new Date(task.start_time)
            const newDate = set(dropDate, {
                hours: originalDate.getHours(),
                minutes: originalDate.getMinutes()
            })

            updateTask.mutate({
                id: taskId,
                start_time: newDate.toISOString()
            })
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-7 gap-4">
                {weekDays.map((day) => {
                    const dayTasks = tasks.filter(t => t.start_time && isSameDay(new Date(t.start_time), day))
                    const isToday = isSameDay(day, today)

                    return (
                        <div
                            key={day.toString()}
                            className="space-y-3"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, day)}
                        >
                            <div className={cn(
                                "p-3 rounded-2xl text-center border transition-all",
                                isToday
                                    ? "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-100"
                                    : "bg-white border-slate-100 shadow-sm"
                            )}>
                                <p className={cn("text-xs font-bold uppercase tracking-widest", isToday ? "text-indigo-100" : "text-slate-400")}>
                                    {format(day, 'EEE', { locale: tr })}
                                </p>
                                <p className={cn("text-xl font-black mt-1", isToday ? "text-white" : "text-slate-900")}>
                                    {format(day, 'd')}
                                </p>
                            </div>

                            <div className="space-y-2 min-h-[200px]">
                                {dayTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, task.id)}
                                        onDragOver={(e) => {
                                            if (e.dataTransfer.types.includes('sticker')) {
                                                e.preventDefault()
                                                e.stopPropagation()
                                            }
                                        }}
                                        onDrop={(e) => {
                                            const sticker = e.dataTransfer.getData('sticker')
                                            if (sticker) {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                updateTask.mutate({ id: task.id, emoji: sticker })
                                            }
                                        }}
                                        className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
                                    >
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-tighter">
                                                {task.categories?.name || 'Genel'}
                                            </p>
                                        </div>
                                        <p className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight flex items-center gap-1.5">
                                            {task.emoji && <span>{task.emoji}</span>}
                                            {task.title}
                                        </p>
                                        <p className="text-[10px] text-slate-400 mt-2 font-medium">
                                            {task.start_time && format(new Date(task.start_time), 'HH:mm')}
                                        </p>
                                    </div>
                                ))}
                                {dayTasks.length === 0 && (
                                    <div className="h-full border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center opacity-40">
                                        <span className="text-[10px] font-bold text-slate-300 uppercase">Boş</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
