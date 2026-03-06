const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env.local") });

async function listAllModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("HATA: GEMINI_API_KEY bulunamadı!");
        return;
    }

    console.log("Bağlantı kontrol ediliyor... (Anahtar: " + apiKey.substring(0, 8) + "...)");
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        // bazi SDK versiyonlarinda listModels farkli olabilir
        // En temel model ile bir deneme yapalim
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Merhaba");
        console.log("BAŞARILI: gemini-1.5-flash çalışıyor!");
    } catch (error) {
        console.error("1.5-flash HATASI:", error.message);

        try {
            console.log("gemini-pro deneniyor...");
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent("Merhaba");
            console.log("BAŞARILI: gemini-pro çalışıyor!");
        } catch (err2) {
            console.error("gemini-pro HATASI:", err2.message);
        }
    }
}

listAllModels();
