import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// 1. API İstemcisini Yapılandır
// (Burası artık boş, genAI POST içinde oluşturuluyor)

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

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("HATA: GEMINI_API_KEY tanımsız!");
            return NextResponse.json({ error: 'API Key eksik! Lütfen .env.local dosyasını kontrol edin.' }, { status: 500 });
        }

        // Modeli her istekte yeniden yapılandırıyoruz (Hata payını azaltmak için)
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const prompt = `Şu ana görevi 3 mantıklı alt göreve böl: ${title}`;
        console.log("AI Breakdown Prompt:", prompt);

        // 3. Yanıtı Al
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("AI Breakdown Raw Response:", text);

        if (!text) {
            throw new Error("Modelden boş yanıt döndü.");
        }

        let subtasks;
        try {
            subtasks = JSON.parse(text);
        } catch (parseError) {
            console.error("JSON Parse Hatası:", text);
            throw new Error("Model geçersiz bir JSON formatı döndürdü.");
        }

        return NextResponse.json({ subtasks });

    } catch (error: any) {
        console.error("Yapay Zeka Hatası Detayı:", error);
        return NextResponse.json({
            error: 'Bir hata oluştu',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}