import { TaskWithCategory, useTasks } from '@/hooks/use-tasks'
import { cn } from '@/lib/utils'
import { isThisMonth, isThisWeek, isToday, parseISO, startOfDay } from 'date-fns'
import { Calendar as CalendarIcon, Check, Clock, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { TaskTimer } from './task-timer'

interface TaskListProps {
    variant?: 'full' | 'dashboard'
}

export function TaskList({ variant = 'full' }: TaskListProps) {
    const { tasks, isLoading, updateTask, deleteTask } = useTasks()
    const [selectedTaskForTimer, setSelectedTaskForTimer] = useState<TaskWithCategory | null>(null)

    if (isLoading) return <div className="text-slate-500 p-8 text-center font-medium">Görevler yükleniyor...</div>
    if (!tasks?.length) return <div className="text-slate-500 p-12 text-center font-medium">Henüz hiç görev yok. Hadi bir tane ekleyelim!</div>

    const today = startOfDay(new Date())

    const todayGroup = tasks.filter(t => t.start_time && isToday(parseISO(t.start_time)))
    const thisWeekGroup = tasks.filter(t => t.start_time && isThisWeek(parseISO(t.start_time), { weekStartsOn: 1 }) && !isToday(parseISO(t.start_time)))
    const thisMonthGroup = tasks.filter(t => t.start_time && isThisMonth(parseISO(t.start_time)) && !isThisWeek(parseISO(t.start_time), { weekStartsOn: 1 }))

    const capturedIds = new Set([...todayGroup, ...thisWeekGroup, ...thisMonthGroup].map(t => t.id))
    const laterGroup = tasks.filter(t => !capturedIds.has(t.id))

    const groups = {
        today: todayGroup,
        thisWeek: thisWeekGroup,
        thisMonth: thisMonthGroup,
        later: laterGroup
    }

    const renderTaskGroup = (title: string, groupTasks: TaskWithCategory[], icon: React.ReactNode) => {
        if (groupTasks.length === 0) return null

        return (
            <div className={cn(variant === 'full' ? "mb-8 last:mb-0" : "mb-6 last:mb-0 px-4 pt-4")}>
                <div className="flex items-center gap-2 mb-4 px-2">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                        {icon}
                    </div>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">{title}</h3>
                    <span className="ml-auto text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                        {groupTasks.length}
                    </span>
                </div>
                <div className={cn(
                    "divide-y divide-slate-50 overflow-hidden",
                    variant === 'full'
                        ? "bg-white rounded-3xl border border-slate-100 shadow-sm"
                        : "bg-slate-50/50 rounded-2xl border border-slate-100"
                )}>
                    {groupTasks.map((task) => (
                        <div
                            key={task.id}
                            onDragOver={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                e.dataTransfer.dropEffect = 'copy'
                                e.currentTarget.classList.add('bg-indigo-50/50', 'ring-2', 'ring-indigo-500/20')
                            }}
                            onDragLeave={(e) => {
                                e.currentTarget.classList.remove('bg-indigo-50/50', 'ring-2', 'ring-indigo-500/20')
                            }}
                            onDrop={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                e.currentTarget.classList.remove('bg-indigo-50/50', 'ring-2', 'ring-indigo-500/20')

                                const sticker = e.dataTransfer.getData('application/focusflow-sticker') ||
                                    e.dataTransfer.getData('text/plain')

                                if (sticker && sticker.length <= 10) {
                                    const finalSticker = sticker.replace('sticker:', '')
                                    updateTask.mutate({ id: task.id, emoji: finalSticker })
                                }
                            }}
                            className={cn(
                                "p-4 flex items-center justify-between transition-all group hover:bg-white border-l-4 border-transparent",
                                task.status === 'done' ? "opacity-60" : "hover:border-indigo-500 cursor-pointer"
                            )}
                            onClick={() => {
                                if (task.status !== 'done') {
                                    setSelectedTaskForTimer(task)
                                }
                            }}
                        >
                            <div className="flex items-center space-x-4 flex-1">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        updateTask.mutate({ id: task.id, status: task.status === 'done' ? 'todo' : 'done' })
                                    }}
                                    className={cn(
                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shadow-sm shrink-0",
                                        task.status === 'done'
                                            ? "bg-indigo-600 border-indigo-600 text-white"
                                            : "bg-white border-slate-200 hover:border-indigo-500"
                                    )}
                                >
                                    {task.status === 'done' && <Check className="w-3 h-3 stroke-[3]" />}
                                </button>
                                <div className="flex-1">
                                    <h4 className={cn(
                                        "text-sm font-bold tracking-tight transition-all flex items-center gap-2",
                                        task.status === 'done' ? "text-slate-400 line-through" : "text-slate-900 group-hover:text-indigo-600"
                                    )}>
                                        {task.emoji && <span className="text-base">{task.emoji}</span>}
                                        {task.title}
                                    </h4>
                                    {task.description && (
                                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 font-medium">
                                            {task.description}
                                        </p>
                                    )}
                                    <div className="flex items-center space-x-2.5 mt-1">
                                        <span className="flex items-center space-x-1 text-slate-400">
                                            <p className="text-[10px] font-bold">
                                                {task.start_time ? new Date(task.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Zaman yok'}
                                            </p>
                                        </span>
                                        {task.category_id && (
                                            <span className="text-[10px] font-black text-indigo-600/60 uppercase tracking-widest bg-indigo-50/50 px-1.5 py-0.5 rounded">
                                                {task.categories?.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    deleteTask.mutate(task.id)
                                }}
                                className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className={cn(variant === 'full' ? "max-w-5xl mx-auto pb-12" : "pb-4")}>
            {renderTaskGroup("Bugün", groups.today, <Clock className="w-4 h-4" />)}
            {renderTaskGroup("Bu Hafta", groups.thisWeek, <CalendarIcon className="w-4 h-4" />)}
            {variant === 'full' && (
                <>
                    {renderTaskGroup("Bu Ay", groups.thisMonth, <CalendarIcon className="w-4 h-4" />)}
                    {renderTaskGroup("Diğer", groups.later, <CalendarIcon className="w-4 h-4" />)}
                </>
            )}
            {variant === 'dashboard' && groups.today.length === 0 && groups.thisWeek.length === 0 && (
                <div className="p-12 text-center text-slate-400">
                    <p className="text-sm font-bold uppercase tracking-widest">Harika!</p>
                    <p className="text-xs mt-1">Bu dönem için beklemede olan bir görevin yok.</p>
                </div>
            )}

            {selectedTaskForTimer && (
                <TaskTimer
                    task={selectedTaskForTimer}
                    onClose={() => setSelectedTaskForTimer(null)}
                />
            )}
        </div>
    )
}
