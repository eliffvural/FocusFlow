const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

async function checkModels() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error('ERROR: GEMINI_API_KEY is missing');
        return;
    }

    const genAI = new GoogleGenerativeAI(key);

    try {
        console.log('--- Checking model: gemini-2.5-flash ---');
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent("Hi");
        console.log('SUCCESS with 2.5-flash:', (await result.response).text());
    } catch (e) {
        console.error('FAILED with 2.5-flash:', e.message);
    }

    try {
        console.log('\n--- Checking model: gemini-1.5-flash ---');
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hi");
        console.log('SUCCESS with 1.5-flash:', (await result.response).text());
    } catch (e) {
        console.error('FAILED with 1.5-flash:', e.message);
    }
}

checkModels();
