import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const { title } = await req.json()
        const apiKey = process.env.GEMINI_API_KEY

        if (!apiKey) return NextResponse.json({ error: 'API Key eksik' }, { status: 500 })

        console.log('--- EXTREME DEBUG ---')
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Görevi 3 alt göreve böl (JSON dizi): ${title}` }] }]
            })
        })

        const data = await response.json()

        if (!response.ok) {
            console.error('GOOGLE API ERROR:', JSON.stringify(data, null, 2))
            return NextResponse.json({
                error: `Google Hatası (${response.status}): ${data.error?.message || 'Bilinmeyen hata'}`,
                details: data.error // UI'da görebilmek için
            }, { status: response.status })
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
        const jsonMatch = text.match(/\[[\s\S]*\]/)
        const subtasks = jsonMatch ? JSON.parse(jsonMatch[0]) : []

        return NextResponse.json({ subtasks })

    } catch (error: any) {
        return NextResponse.json({ error: 'Sistem Hatası: ' + error.message }, { status: 500 })
    }
}