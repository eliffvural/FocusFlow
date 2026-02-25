'use client'

import { Header } from '@/components/dashboard/header'
import { Sidebar } from '@/components/dashboard/sidebar'

export function DashboardContent({
    children,
    activeTab,
    onTabChange
}: {
    children: React.ReactNode,
    activeTab: string,
    onTabChange: (id: string) => void
}) {
    return (
        <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
            <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
            <div className="flex-1 flex flex-col min-w-0">
                <Header />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
