const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

async function test() {
    const key = process.env.GEMINI_API_KEY;
    console.log('Key:', key ? (key.substring(0, 10) + '...') : 'Missing');

    if (!key) {
        console.error('ERROR: GEMINI_API_KEY is missing in .env.local');
        return;
    }

    const genAI = new GoogleGenerativeAI(key);

    // Test schema as used in route.ts
    const schema = {
        description: "Alt görevler listesi",
        type: "ARRAY", // Try string type instead of Enum if it fails
        items: {
            type: "STRING",
        },
    };

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: schema,
        },
    });

    try {
        console.log('Starting AI generation...');
        const result = await model.generateContent("Şu ana görevi 3 mantıklı alt göreve böl: Kitap oku.");
        const response = await result.response;
        console.log('Response body:', response.text());
        console.log('SUCCESS!');
    } catch (e) {
        console.error('AI GENERATION FAILED:');
        console.error('Message:', e.message);
        if (e.response) {
            console.error('Response details:', JSON.stringify(e.response, null, 2));
        }
    }
}

test();
