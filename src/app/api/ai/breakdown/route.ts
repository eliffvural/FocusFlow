import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: Request) {
    try {
        const { title } = await req.json()

        if (!title) {
            return NextResponse.json({ error: 'Görev başlığı gerekli' }, { status: 400 })
        }

        if (!process.env.GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY is missing in env')
            return NextResponse.json({ error: 'API Anahtarı bulunamadı' }, { status: 500 })
        }

        const modelName = 'gemini-1.5-flash'
        console.log('Using model:', modelName)
        const model = genAI.getGenerativeModel({ model: modelName })

        const prompt = `
            Aşağıdaki görevi 3-5 adet mantıklı ve aksiyon alınabilir alt göreve böl. 
            Sadece bir JSON dizi formatında yanıt ver. Örn: ["Alt görev 1", "Alt görev 2"]
            Dikkat: Sadece geçerli bir JSON dizisi döndür, başka hiçbir metin ekleme.
            
            Görev: ${title}
            Dil: Türkçe
        `

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()
        console.log('Gemini Raw Response:', text)

        // JSON formatını temizle (bazı durumlarda markdown bloğu içinde gelebilir)
        const jsonMatch = text.match(/\[[\s\S]*\]/)
        if (!jsonMatch) {
            console.error('Could not find JSON in response:', text)
            return NextResponse.json({ error: 'AI geçersiz bir yanıt döndürdü' }, { status: 500 })
        }

        const subtasks = JSON.parse(jsonMatch[0])

        return NextResponse.json({ subtasks })
    } catch (error: any) {
        console.error('AI Breakdown Error:', error)
        return NextResponse.json({ error: 'AI Hatası: ' + (error.message || 'Bilinmeyen hata') }, { status: 500 })
    }
}
