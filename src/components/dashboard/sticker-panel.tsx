'use client'


const STICKERS = ['🎯', '📚', '💻', '🏃', '🍕', '🎨', '✈️', '🏠', '💼', '💡', '🔥', '✅', '⭐', '📅', '📝']

export function StickerPanel() {
    const handleDragStart = (e: React.DragEvent, sticker: string) => {
        e.dataTransfer.effectAllowed = 'copy'
        e.dataTransfer.setData('text/plain', sticker)
        e.dataTransfer.setData('application/focusflow-sticker', sticker)
    }

    return (
        <div className="p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200 mt-auto">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">
                Stickerlar
            </h4>
            <div className="grid grid-cols-5 gap-2">
                {STICKERS.map((sticker) => (
                    <div
                        key={sticker}
                        draggable
                        onDragStart={(e) => handleDragStart(e, sticker)}
                        className="w-8 h-8 flex items-center justify-center text-lg cursor-grab active:cursor-grabbing hover:bg-white hover:shadow-sm rounded-lg transition-all hover:scale-125"
                    >
                        {sticker}
                    </div>
                ))}
            </div>
            <p className="text-[9px] text-slate-400 mt-3 font-medium text-center italic">
                Sürükle ve göreve yapıştır!
            </p>
        </div>
    )
}
