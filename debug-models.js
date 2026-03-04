const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env.local") });

async function checkAvailableModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return console.error("API Key yok");

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        console.log("Mevcut modeller sorgulanıyor...");
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("API HATASI:", data.error.message);
            return;
        }

        console.log("Kullanılabilir Modeller:");
        data.models.forEach(m => {
            console.log(`- ${m.name} (Desteklenenler: ${m.supportedGenerationMethods.join(", ")})`);
        });
    } catch (error) {
        console.error("Sorgu Hatası:", error.message);
    }
}

checkAvailableModels();
