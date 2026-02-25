'use client'

import { DashboardContent } from '@/components/dashboard/dashboard-content'
import { useSupabase } from '@/components/providers/supabase-provider'
import { CreateTaskDialog } from '@/components/tasks/create-task-dialog'
import { TaskList } from '@/components/tasks/task-list'
import { TaskWithCategory, useTasks } from '@/hooks/use-tasks'
import { AppWindow, CheckCircle2, Clock, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Home() {
    const [activeTab, setActiveTab] = useState('dashboard')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
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

                    <div className="grid grid-cols-1 gap-8 items-start">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-xl font-bold text-slate-900">Yaklaşan Görevler</h3>
                                <button
                                    onClick={() => onTabChange('tasks')}
                                    className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
                                >
                                    Tümünü Yönet
                                </button>
                            </div>

                            <TaskList variant="dashboard" />
                        </div>
                    </div>
                </div>
            ) : activeTab === 'tasks' ? (
                <div className="max-w-6xl mx-auto space-y-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Görevlerim</h2>
                            <p className="text-slate-500 mt-1">Tüm görevlerini zaman skalasına göre takip et.</p>
                        </div>
                        <button
                            onClick={() => setIsDialogOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md active:scale-95"
                        >
                            Yeni Görev +
                        </button>
                    </div>
                    <TaskList />
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
