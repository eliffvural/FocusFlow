const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error('ERROR: GEMINI_API_KEY is missing');
        return;
    }

    const genAI = new GoogleGenerativeAI(key);

    try {
        // This is the correct way to list models in the JS SDK
        // However, the current SDK might not have a direct listModels call.
        // Usually, people check the documentation or try common names.
        // Let's try the common ones.
        const models = [
            "gemini-1.5-flash",
            "gemini-1.5-pro",
            "gemini-2.0-flash-exp",
            "gemini-2.5-flash"
        ];

        for (const m of models) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                await model.generateContent("test");
                console.log(`Model ${m} is AVAILABLE`);
            } catch (e) {
                console.log(`Model ${m} is NOT available: ${e.message}`);
            }
        }
    } catch (e) {
        console.error('Error listing models:', e.message);
    }
}

listModels();
