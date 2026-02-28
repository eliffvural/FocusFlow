'use client'

import { useStickyNotes } from '@/hooks/use-sticky-notes'
import { Plus, StickyNote as StickyNoteIcon } from 'lucide-react'
import { StickyNote } from './sticky-note'

export function StickyNoteBoard() {
    const { notes, isLoading, addNote } = useStickyNotes()

    if (isLoading) return <div className="p-12 text-center text-slate-400 text-sm font-medium">Notlar yükleniyor...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-yellow-100 rounded-xl text-yellow-600">
                        <StickyNoteIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Not Kağıtlarım</h3>
                        <p className="text-xs text-slate-500 font-medium">Hızlı düşüncelerini buraya iliştir.</p>
                    </div>
                </div>
                <button
                    onClick={() => addNote.mutate('Yeni bir not...')}
                    className="flex items-center gap-2 bg-white border border-slate-200 hover:border-yellow-200 hover:bg-yellow-50 text-slate-600 hover:text-yellow-600 px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Not Ekle
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {notes?.map((note) => (
                    <StickyNote key={note.id} note={note} />
                ))}

                {notes?.length === 0 && (
                    <div
                        onClick={() => addNote.mutate('Yeni bir not...')}
                        className="aspect-square rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-yellow-300 hover:bg-yellow-50/50 transition-all cursor-pointer group"
                    >
                        <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-yellow-100 transition-colors">
                            <Plus className="w-6 h-6 group-hover:text-yellow-600" />
                        </div>
                        <p className="text-xs font-bold mt-4 tracking-wide uppercase opacity-60">İlk Notu Ekle</p>
                    </div>
                )}
            </div>
        </div>
    )
}
