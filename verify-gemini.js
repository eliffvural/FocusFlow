const https = require('https');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const apiKey = process.env.GEMINI_API_KEY;
const results = {
    key_check: apiKey ? `Found (Starts with ${apiKey.substring(0, 5)}...)` : 'MISSING',
    attempts: []
};

async function test(version, model) {
    return new Promise((resolve) => {
        const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`;
        const req = https.request(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, (res) => {
            let data = '';
            res.on('data', (d) => data += d);
            res.on('end', () => {
                resolve({
                    version,
                    model,
                    status: res.statusCode,
                    body: data.substring(0, 200) // Sadece başını alalım
                });
            });
        });

        req.on('error', (e) => resolve({ version, model, error: e.message }));
        req.write(JSON.stringify({ contents: [{ parts: [{ text: 'hi' }] }] }));
        req.end();
    });
}

async function run() {
    const versions = ['v1', 'v1beta'];
    const models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro', 'gemini-pro'];

    for (const v of versions) {
        for (const m of models) {
            console.log(`Testing ${v}/${m}...`);
            const res = await test(v, m);
            results.attempts.push(res);
        }
    }

    fs.writeFileSync('gemini-diagnosis.json', JSON.stringify(results, null, 2));
    console.log('Teşhis tamamlandı: gemini-diagnosis.json');
}

run();
