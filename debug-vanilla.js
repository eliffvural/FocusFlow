const https = require('https');

const apiKey = "AIzaSyBQJHxnVQhE5ZpXknc8d_BA-V9_2SzQjcY";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log("Sorgu gönderiliyor...");

https.get(url, (res) => {
    let data = '';
    console.log('Durum Kodu:', res.statusCode);

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Yanıt Alındı:');
        try {
            const parsed = JSON.parse(data);
            console.log(JSON.stringify(parsed, null, 2));
        } catch (e) {
            console.log("Ham Yanıt:", data);
        }
    });

}).on("error", (err) => {
    console.log("Hata: " + err.message);
});
