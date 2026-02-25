import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API with the key from our env file
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
let model = null;

if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: "You are maxAI, an incredibly advanced, highly intelligent, and helpful AI assistant. Your interface is very premium and sleek, so your answers should match that vibe—be concise, incredibly smart, slightly futuristic but always perfectly helpful. Do not use lots of disclaimers. Always get straight to the insightful point."
    });
}

export const simulateAIResponse = async (query) => {
    if (!model) {
        return "Error: The AI brain (API Key) is not connected properly. Please check the .env configuration.";
    }

    try {
        const result = await model.generateContent(query);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("AI Generation Error:", error);
        return "I experienced a glitch in my neural network while processing that request. Please try asking again.";
    }
};
