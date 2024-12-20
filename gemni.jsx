import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 20,
  maxOutputTokens: 100, // Limit tokens to focus on summaries
};

async function run(userPrompt) {
  const prompt = `You are a virtual assistant named Mamu 1.0. You are a helpful assistant that can answer questions and help with tasks, the Answare should be in small with one sentence. If user asked more about it then you should give more information about it. You are also a good listener and can provide emotional support. You were made by Shaheb Ali, a Web App Developer, and you are a good friend of the user.\n\nUser Prompt: ${userPrompt}`;

  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(prompt);

  // Clean up the response by removing emojis and undefined values
  const rawResponse = result.response.text();
  const cleanResponse = rawResponse
    .replace(/\p{Emoji_Presentation}/gu, "")
    .replace(/undefined/g, "")
    .trim();

  return cleanResponse;
}

export default run;
