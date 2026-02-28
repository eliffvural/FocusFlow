'use client'

import { cn } from '@/lib/utils'
import { Calendar, CheckSquare, LayoutDashboard, LogOut, Plus, Settings, X } from 'lucide-react'
import { useSupabase } from '../providers/supabase-provider'
import { StickerPanel } from './sticker-panel'

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
    { icon: Calendar, label: 'Takvim', id: 'calendar' },
    { icon: CheckSquare, label: 'Görevler', id: 'tasks' },
    { icon: Settings, label: 'Ayarlar', id: 'settings' },
]

interface SidebarProps {
    activeTab: string
    onTabChange: (id: string) => void
    isOpen?: boolean
    onClose?: () => void
}

export function Sidebar({ activeTab, onTabChange, isOpen, onClose }: SidebarProps) {
    const { supabase } = useSupabase()

    const handleLogout = async () => {
        await supabase.auth.signOut()
    }

    return (
        <div className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col p-4 space-y-8 transition-transform duration-300 transform md:relative md:translate-x-0 md:z-0",
            isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        )}>
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">F</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">FocusFlow</span>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg md:hidden"
                >
                    <X className="w-5 h-5" />
                </button>
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

            <StickerPanel />

            <div className="mt-auto px-2 space-y-4">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 transition-all font-medium"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Çıkış Yap</span>
                </button>

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
