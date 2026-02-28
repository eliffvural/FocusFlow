'use client'

import { StickyNote as StickyNoteType, useStickyNotes } from '@/hooks/use-sticky-notes'
import { cn } from '@/lib/utils'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'

interface StickyNoteProps {
    note: StickyNoteType
}

export function StickyNote({ note }: StickyNoteProps) {
    const { updateNote, deleteNote } = useStickyNotes()
    const [content, setContent] = useState(note.content)

    const colorClasses: Record<string, string> = {
        yellow: 'bg-yellow-100 border-yellow-200 text-yellow-900',
        blue: 'bg-blue-100 border-blue-200 text-blue-900',
        green: 'bg-green-100 border-green-200 text-green-900',
        pink: 'bg-pink-100 border-pink-200 text-pink-900',
        purple: 'bg-purple-100 border-purple-200 text-purple-900'
    }

    const handleBlur = () => {
        if (content !== note.content) {
            updateNote.mutate({ id: note.id, content })
        }
    }

    return (
        <div className={cn(
            "p-6 rounded-2xl border aspect-square flex flex-col shadow-sm transition-all hover:shadow-md hover:-rotate-1 relative group",
            colorClasses[note.color] || colorClasses.yellow
        )}>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onBlur={handleBlur}
                className="flex-1 bg-transparent border-none focus:outline-none resize-none font-medium text-sm leading-relaxed"
                placeholder="Bir şeyler yazın..."
            />

            <button
                onClick={() => deleteNote.mutate(note.id)}
                className="absolute top-2 right-2 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/5 rounded-lg text-black/40 hover:text-red-500"
            >
                <Trash2 className="w-4 h-4" />
            </button>

            <div className="mt-4 flex items-center justify-between">
                <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">
                    {new Date(note.created_at).toLocaleDateString()}
                </p>
                <div className="flex gap-1">
                    {Object.keys(colorClasses).map((color) => (
                        <button
                            key={color}
                            onClick={() => updateNote.mutate({ id: note.id, color })}
                            className={cn(
                                "w-2.5 h-2.5 rounded-full border border-black/5 transition-transform hover:scale-125",
                                color === 'yellow' && 'bg-yellow-400',
                                color === 'blue' && 'bg-blue-400',
                                color === 'green' && 'bg-green-400',
                                color === 'pink' && 'bg-pink-400',
                                color === 'purple' && 'bg-purple-400',
                                note.color === color && 'ring-2 ring-black/10 scale-125'
                            )}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
