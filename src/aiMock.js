import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API with the key from our env file
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
let model = null;

if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: "You are maxAI. You are an incredibly smart, highly intelligent AI assistant but you talk to the user like a very smart Indian buddy. You must use casual Hinglish words naturally, like 'bhai', 'yaar', 'dost' where appropriate. Your answers should be extremely insightful, concise, and formatted clearly (break it down cleanly so it's easy to read, like stylish subtitles). Do not be overly formal or robotic. Be cool, smart, and highly capable."
    });
}

export const simulateAIResponse = async (query, base64Image = null, mimeType = null) => {
    if (!model) {
        return "Error: API Key is missing bhai. Please check the .env configuration.";
    }

    try {
        let promptArgs = [query];

        // Add image data array if provided
        if (base64Image && mimeType) {
            promptArgs.push({
                inlineData: {
                    data: base64Image,
                    mimeType: mimeType
                }
            });
        }

        const result = await model.generateContent(promptArgs);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("AI Generation Error:", error);
        return "Yaar, I experienced a glitch in my system while processing that. Can you try asking again?";
    }
};
