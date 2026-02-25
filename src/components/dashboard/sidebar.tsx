'use client'

import { cn } from '@/lib/utils'
import { Calendar, CheckSquare, Focus, LayoutDashboard, Plus, Settings } from 'lucide-react'

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
    { icon: Calendar, label: 'Takvim', id: 'calendar' },
    { icon: CheckSquare, label: 'Görevler', id: 'tasks' },
    { icon: Focus, label: 'Odak Modu', id: 'focus' },
    { icon: Settings, label: 'Ayarlar', id: 'settings' },
]

interface SidebarProps {
    activeTab: string
    onTabChange: (id: string) => void
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
    return (
        <div className="w-64 h-full bg-white border-r border-slate-200 flex flex-col p-4 space-y-8">
            <div className="flex items-center space-x-2 px-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">F</span>
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900">FocusFlow</span>
            </div>

            <nav className="flex-1 space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={cn(
                            "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all",
                            activeTab === item.id
                                ? "bg-indigo-50 text-indigo-600"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        )}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="mt-auto px-2">
                <div className="bg-slate-900 rounded-xl p-4 shadow-sm">
                    <p className="text-xs text-slate-400 font-medium mb-1">Yeni Plan</p>
                    <p className="text-sm text-white font-bold mb-3">Verimliliğini artır</p>
                    <button className="w-full bg-white text-slate-900 text-xs font-bold py-2 rounded-lg flex items-center justify-center transition-colors hover:bg-slate-100">
                        <Plus className="w-3 h-3 mr-1" /> Yeni Görev
                    </button>
                </div>
            </div>
        </div>
    )
}
