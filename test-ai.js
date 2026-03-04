const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env.local") });

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return console.error("API Key yok");

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        // Bu metod SDK versiyonuna göre değişebilir, genelde API ile modelleri çekmek daha güvenlidir.
        // Şimdilik doğrudan deneme yanılma ve listeme yapalım.
        console.log("Model testi başlatılıyor...");

        const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];

        for (const modelName of models) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Test");
                if (result) {
                    console.log(`BAŞARILI: ${modelName} çalışıyor.`);
                }
            } catch (e) {
                console.log(`HATA: ${modelName} çalışmadı. Mesaj: ${e.message}`);
            }
        }
    } catch (error) {
        console.error("Genel Hata:", error.message);
    }
}

listModels();
