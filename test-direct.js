const { GoogleGenerativeAI } = require("@google/generative-ai");

// Kullanıcının .env.local dosyasındaki anahtarı
const apiKey = "AIzaSyBQJHxnVQhE5ZpXknc8d_BA-V9_2SzQjcY";

async function test() {
    console.log("Bağlantı testi başlatılıyor...");
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        // En temel modeli dene
        console.log("Model: gemini-pro deneniyor...");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Merhaba");
        const response = await result.response;
        console.log("BAŞARILI! Yanıt:", response.text());
    } catch (error) {
        console.error("HATA:", error.message);
        if (error.stack) console.error("STACK:", error.stack);
    }
}

test();
