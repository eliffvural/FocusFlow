import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function test() {
    const key = process.env.GEMINI_API_KEY;
    console.log('Key:', key ? (key.substring(0, 5) + '...') : 'Missing');

    if (!key) return;

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING }
            }
        }
    });

    try {
        const result = await model.generateContent("Bir görev ver: Kitap oku. Bunu 3 alt adıma böl.");
        console.log('Response:', await result.response.text());
    } catch (e) {
        console.error('Error:', e.message);
    }
}

test();
