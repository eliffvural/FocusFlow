const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env.local") });

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("API Key bulunamadı!");
        return;
    }

    // API version v1 deneyelim
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        console.log("Model listesi alınıyor...");
        // SDK listModels metodunu destekler
        const result = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // Basit bir test yapalım
        const test = await result.generateContent("test");
        console.log("Test Başarılı!");
    } catch (error) {
        console.error("HATA DETAYI:", error);
        if (error.message.includes("404")) {
            console.log("İpucu: Model bulunamadı hatası alınıyor. API anahtarı veya model ismi hatalı olabilir.");
        }
    }
}

listModels();
