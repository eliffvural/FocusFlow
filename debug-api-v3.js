const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

async function test() {
    const key = process.env.GEMINI_API_KEY;
    console.log('Key:', key ? (key.substring(0, 10) + '...') : 'Missing');

    if (!key) return;

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        console.log('Sending baseline request...');
        const result = await model.generateContent("Hi");
        console.log('Response:', result.response.text());
        console.log('SUCCESS!');
    } catch (e) {
        console.error('FAILED:', e.message);
    }
}

test();
