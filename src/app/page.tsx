'use client'

import { CalendarView } from '@/components/dashboard/calendar-view'
import { DashboardContent } from '@/components/dashboard/dashboard-content'
import { useSupabase } from '@/components/providers/supabase-provider'
import { CreateTaskDialog } from '@/components/tasks/create-task-dialog'
import { TaskList } from '@/components/tasks/task-list'
import { usePomodoro } from '@/hooks/use-pomodoro'
import { TaskWithCategory, useTasks } from '@/hooks/use-tasks'
import { cn } from '@/lib/utils'
import { AppWindow, CheckCircle2, Clock, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Home() {
    const [activeTab, setActiveTab] = useState('dashboard')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const { formatTime, isActive, startTimer, pauseTimer, progress, timeLeft } = usePomodoro()
    const { tasks } = useTasks()
    const { user, supabase } = useSupabase()
    const router = useRouter()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login')
            }
        }
        checkUser()
    }, [supabase, router])

    if (!user) return null

    const completedTasks = tasks?.filter((t: TaskWithCategory) => t.status === 'done').length || 0
    const pendingTasks = tasks?.filter((t: TaskWithCategory) => t.status !== 'done').length || 0
    const totalTasks = tasks?.length || 0
    const efficiency = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    const stats = [
        { label: 'Toplam Görev', value: totalTasks.toString(), icon: AppWindow, color: 'text-blue-500' },
        { label: 'Tamamlanan', value: completedTasks.toString(), icon: CheckCircle2, color: 'text-green-500' },
        { label: 'Bekleyen', value: pendingTasks.toString(), icon: Clock, color: 'text-orange-500' },
        { label: 'Verimlilik', value: `%${efficiency}`, icon: TrendingUp, color: 'text-indigo-500' },
    ]

    return (
        <DashboardContent activeTab={activeTab} onTabChange={setActiveTab}>
            {activeTab === 'dashboard' ? (
                <div className="max-w-6xl mx-auto space-y-10 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Hoş Geldin!</h2>
                            <p className="text-slate-500 mt-1">İşte bugünkü planın ve ilerlemen.</p>
                        </div>
                        <button
                            onClick={() => setIsDialogOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md shadow-indigo-100 active:scale-95"
                        >
                            Yeni Görev +
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat) => (
                            <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`${stat.color.replace('text-', 'bg-')}/10 p-2.5 rounded-xl`}>
                                        <stat.icon className={`${stat.color} w-5 h-5`} />
                                    </div>
                                    <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Genel</span>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                                    <p className="text-sm font-medium text-slate-500 mt-0.5">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-8 space-y-6">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-xl font-bold text-slate-900">Görev Listesi</h3>
                                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold">Tümünü Yönet</button>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <TaskList />
                            </div>
                        </div>

                        <div className="lg:col-span-4 space-y-6">
                            <h3 className="text-xl font-bold text-slate-900 px-1">Odak Modu</h3>
                            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-8">
                                <div className="relative w-48 h-48 flex items-center justify-center">
                                    <svg className="w-full h-full -rotate-90">
                                        <circle cx="96" cy="96" r="86" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100" />
                                        <circle cx="96" cy="96" r="86" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-indigo-600 transition-all duration-1000" strokeDasharray="540" strokeDashoffset={progress * (540 / 440)} />
                                    </svg>
                                    <span className="absolute text-4xl font-black text-slate-900 font-mono tracking-tighter">{formatTime(timeLeft)}</span>
                                </div>
                                <div className="space-y-2">
                                    <p className="font-bold text-slate-900 text-xl tracking-tight">Pomodoro Oturumu</p>
                                    <p className="text-sm font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
                                        {isActive ? 'Odaklanma zamanı...' : 'Başlamaya hazır mısın?'}
                                    </p>
                                </div>
                                <button
                                    onClick={isActive ? pauseTimer : startTimer}
                                    className={cn(
                                        "w-full font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-95 text-base",
                                        isActive
                                            ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                            : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 border-b-4 border-indigo-800"
                                    )}
                                >
                                    {isActive ? 'Duraklat' : 'Zamanlayıcıyı Başlat'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : activeTab === 'calendar' ? (
                <div className="max-w-6xl mx-auto space-y-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Takvim</h2>
                            <p className="text-slate-500 mt-1">Haftalık planını ve zamanlanmış görevlerini gör.</p>
                        </div>
                        <button
                            onClick={() => setIsDialogOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md active:scale-95"
                        >
                            Görev Planla +
                        </button>
                    </div>
                    <CalendarView tasks={tasks || []} />
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
                    <p className="text-lg font-medium">Bu bölüm yakında eklenecek.</p>
                </div>
            )}
            <CreateTaskDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
            />
        </DashboardContent>
    )
}
