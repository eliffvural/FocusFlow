const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

async function check() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        fs.writeFileSync('api_response.json', JSON.stringify(data, null, 2));
        console.log('Yanıt api_response.json dosyasına yazıldı.');
    } catch (error) {
        fs.writeFileSync('api_response.json', JSON.stringify({ error: error.message }, null, 2));
    }
}

check();
