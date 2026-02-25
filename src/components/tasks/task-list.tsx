'use client'

import { TaskWithCategory, useTasks } from '@/hooks/use-tasks'
import { cn } from '@/lib/utils'
import { Check, Clock, Trash2 } from 'lucide-react'

export function TaskList() {
    const { tasks, isLoading, updateTask, deleteTask } = useTasks()

    if (isLoading) return <div className="text-slate-500 p-8 text-center font-medium">Görevler yükleniyor...</div>
    if (!tasks?.length) return <div className="text-slate-500 p-12 text-center font-medium">Henüz hiç görev yok. Hadi bir tane ekleyelim!</div>

    return (
        <div className="divide-y divide-slate-100">
            {tasks.map((task: TaskWithCategory) => (
                <div
                    key={task.id}
                    className={cn(
                        "p-5 flex items-center justify-between transition-all group hover:bg-slate-50/80",
                        task.status === 'done' && "bg-slate-50/40"
                    )}
                >
                    <div className="flex items-center space-x-5">
                        <button
                            onClick={() => updateTask.mutate({ id: task.id, status: task.status === 'done' ? 'todo' : 'done' })}
                            className={cn(
                                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shadow-sm",
                                task.status === 'done'
                                    ? "bg-indigo-600 border-indigo-600 text-white"
                                    : "bg-white border-slate-200 hover:border-indigo-500"
                            )}
                        >
                            {task.status === 'done' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>
                        <div>
                            <h4 className={cn(
                                "font-bold tracking-tight transition-all",
                                task.status === 'done' ? "text-slate-400 line-through" : "text-slate-900"
                            )}>
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
    )
}
