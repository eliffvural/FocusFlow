import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// 1. API İstemcisini Yapılandır
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// JSON formatını zorlamak için bir şema (Schema) tanımlıyoruz
// Bu sayede modelin hata yapma şansı kalmıyor
const schema = {
    description: "Alt görevler listesi",
    type: SchemaType.ARRAY,
    items: {
        type: SchemaType.STRING,
    },
};

export async function POST(req: Request) {
    try {
        const { title } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'API Key eksik!' }, { status: 500 });
        }

        // 2. Modeli Seç (Gemini 1.5 Flash en hızlısıdır)
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const prompt = `Şu ana görevi 3 mantıklı alt göreve böl: ${title}`;

        // 3. Yanıtı Al
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Model zaten saf JSON döndüreceği için direkt parse edebiliriz
        const subtasks = JSON.parse(text);

        return NextResponse.json({ subtasks });

    } catch (error: any) {
        console.error("Yapay Zeka Hatası:", error);
        return NextResponse.json({
            error: 'Bir hata oluştu',
            details: error.message
        }, { status: 500 });
    }
}