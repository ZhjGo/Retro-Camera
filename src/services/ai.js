import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
// Note: In a real app, use import.meta.env.VITE_GEMINI_API_KEY
// For this demo, we'll check if the key exists, otherwise return mock data.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateCaption = async (imageBase64, language = 'en') => {
    if (!API_KEY) {
        console.warn("No Gemini API Key found. Using mock response.");
        await new Promise(resolve => setTimeout(resolve, 1500));
        const mocks = {
            en: [
                "A moment frozen in time.",
                "Retro vibes only.",
                "Capturing the soul of the moment.",
                "Memories that last forever.",
                "Just like the old days."
            ],
            zh: [
                "定格美好瞬间。",
                "复古情怀。",
                "捕捉灵魂的片刻。",
                "永恒的记忆。",
                "就像旧时光一样。"
            ]
        };
        const langMocks = mocks[language] || mocks.en;
        return langMocks[Math.floor(Math.random() * langMocks.length)];
    }

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Remove header from base64 string
        const base64Data = imageBase64.split(',')[1];

        const prompt = `Generate a warm, short, handwritten-style blessing or nice comment (max 10 words) based on this photo. The language MUST be ${language === 'zh' ? 'Chinese (Simplified)' : 'English'}.`;

        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: "image/jpeg",
            },
        };

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();
        return text.trim();
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};
