'use client'

import { useSupabase } from '@/components/providers/supabase-provider'
import { Bell, Menu, Search, User } from 'lucide-react'

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
    const { user } = useSupabase()

    return (
        <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-lg md:hidden"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div className="relative w-full max-w-md hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Görev ara..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-400 text-slate-900"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <button className="p-2 text-slate-500 hover:text-slate-900 transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white" />
                </button>

                <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200 rounded-full pl-2 pr-4 py-1">
                    <div className="w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm">
                        <User className="w-4 h-4 text-slate-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                        {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                    </span>
                </div>
            </div>
        </header>
    )
}
