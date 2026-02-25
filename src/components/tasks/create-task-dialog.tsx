'use client'

import { Button, Input } from '@/components/ui/base'
import { useCategories } from '@/hooks/use-categories'
import { useTasks } from '@/hooks/use-tasks'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { useState } from 'react'

export function CreateTaskDialog({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [emoji, setEmoji] = useState('')
    const { addTask } = useTasks()
    const { categories } = useCategories()

    // Diyalog açıldığında varsayılan olarak şu anın tarihini set et
    useState(() => {
        const now = new Date()
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
        setStartTime(now.toISOString().slice(0, 16))
    })

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await addTask.mutateAsync({
            title,
            description,
            category_id: categoryId || null,
            start_time: startTime || null,
            end_time: endTime || null,
            emoji: emoji || null,
            status: 'todo'
        } as any)
        setTitle('')
        setDescription('')
        setCategoryId('')
        setStartTime('')
        setEndTime('')
        setEmoji('')
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-2xl p-8 space-y-8 relative border border-slate-200 shadow-2xl">
                <button onClick={onClose} className="absolute right-6 top-6 text-slate-400 hover:text-slate-900 transition-colors p-1 hover:bg-slate-50 rounded-full">
                    <X className="w-5 h-5" />
                </button>

                <div className="space-y-1.5 cursor-default">
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Yeni Görev Ekle</h3>
                    <p className="text-sm font-medium text-slate-500">Yapılacak yeni bir iş tanımlayın.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-0.5 uppercase tracking-wide">Başlık</label>
                        <Input
                            placeholder="Örn: Sunum Hazırlığı"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-slate-50/50 border-slate-200 focus:bg-white text-slate-900 placeholder:text-slate-400 h-12 rounded-xl"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-0.5 uppercase tracking-wide">Tarih / Saat</label>
                            <Input
                                type="datetime-local"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="bg-slate-50/50 border-slate-200 focus:bg-white text-slate-900 h-12 rounded-xl text-xs font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-0.5 uppercase tracking-wide">Bitiş (Opsiyonel)</label>
                            <Input
                                type="datetime-local"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="bg-slate-50/50 border-slate-200 focus:bg-white text-slate-900 h-12 rounded-xl text-xs font-bold"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-0.5 uppercase tracking-wide">Açıklama</label>
                        <textarea
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-3.5 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 min-h-[120px] resize-none"
                            placeholder="Görev hakkında kısa notlar ekleyin..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-0.5 uppercase tracking-wide">Kategori</label>
                        <select
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-3 text-sm font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-900"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            <option value="">Kategori Seçin</option>
                            {categories?.map((cat: any) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-0.5 uppercase tracking-wide">İkon / Emoji</label>
                        <div className="flex flex-wrap gap-2 p-2 bg-slate-50/50 border border-slate-200 rounded-xl">
                            {['🎯', '📚', '💻', '🏃', '🍕', '🎨', '✈️', '🏠', '💼', '💡'].map((e) => (
                                <button
                                    key={e}
                                    type="button"
                                    onClick={() => setEmoji(e)}
                                    className={cn(
                                        "w-10 h-10 flex items-center justify-center rounded-lg text-xl transition-all",
                                        emoji === e ? "bg-indigo-600 shadow-md scale-110" : "hover:bg-white hover:shadow-sm"
                                    )}
                                >
                                    {e}
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => setEmoji('')}
                                className={cn(
                                    "w-10 h-10 flex items-center justify-center rounded-lg text-xs font-bold text-slate-400 transition-all",
                                    !emoji ? "bg-slate-200" : "hover:bg-white hover:shadow-sm"
                                )}
                            >
                                Temizle
                            </button>
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95 border-b-4 border-indigo-800" disabled={addTask.isPending}>
                            {addTask.isPending ? 'Ekleniyor...' : 'Görevi Oluştur'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
