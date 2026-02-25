import { TaskWithCategory, useTasks } from '@/hooks/use-tasks'
import { cn } from '@/lib/utils'
import { isThisMonth, isThisWeek, isToday, parseISO, startOfDay } from 'date-fns'
import { Calendar as CalendarIcon, Check, Clock, Trash2 } from 'lucide-react'

export function TaskList() {
    const { tasks, isLoading, updateTask, deleteTask } = useTasks()

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
            <div className="mb-8 last:mb-0">
                <div className="flex items-center gap-2 mb-4 px-2">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                        {icon}
                    </div>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">{title}</h3>
                    <span className="ml-auto text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                        {groupTasks.length} GÖREV
                    </span>
                </div>
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm divide-y divide-slate-50 overflow-hidden">
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
                                "p-5 flex items-center justify-between transition-all group hover:bg-slate-50/80 border-l-4 border-transparent",
                                task.status === 'done' ? "bg-slate-50/40" : "hover:border-indigo-500"
                            )}
                        >
                            <div className="flex items-center space-x-5 flex-1">
                                <button
                                    onClick={() => updateTask.mutate({ id: task.id, status: task.status === 'done' ? 'todo' : 'done' })}
                                    className={cn(
                                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shadow-sm shrink-0",
                                        task.status === 'done'
                                            ? "bg-indigo-600 border-indigo-600 text-white"
                                            : "bg-white border-slate-200 hover:border-indigo-500"
                                    )}
                                >
                                    {task.status === 'done' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </button>
                                <div className="flex-1">
                                    <h4 className={cn(
                                        "font-bold tracking-tight transition-all flex items-center gap-2",
                                        task.status === 'done' ? "text-slate-400 line-through" : "text-slate-900 group-hover:text-indigo-600"
                                    )}>
                                        {task.emoji && <span className="text-lg">{task.emoji}</span>}
                                        {task.title}
                                    </h4>
                                    <div className="flex items-center space-x-3 mt-1.5">
                                        <span className="flex items-center space-x-1 text-slate-400">
                                            <Clock className="w-3.5 h-3.5" />
                                            <p className="text-xs font-medium">
                                                {task.start_time ? new Date(task.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Zaman belirlenmedi'}
                                            </p>
                                        </span>
                                        {task.category_id && (
                                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                                        )}
                                        <span className="text-xs font-semibold text-indigo-600/70 uppercase tracking-wider">
                                            {task.categories?.name}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => deleteTask.mutate(task.id)}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-4.5 h-4.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto pb-12">
            {renderTaskGroup("Bugün", groups.today, <Clock className="w-4 h-4" />)}
            {renderTaskGroup("Bu Hafta", groups.thisWeek, <CalendarIcon className="w-4 h-4" />)}
            {renderTaskGroup("Bu Ay", groups.thisMonth, <CalendarIcon className="w-4 h-4" />)}
            {renderTaskGroup("Daha Sonra / Belirsiz", groups.later, <CalendarIcon className="w-4 h-4" />)}
        </div>
    )
}
