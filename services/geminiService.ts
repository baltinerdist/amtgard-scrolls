import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is not set in process.env");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateScrollText = async (
  recipient: string,
  award: string,
  vibe: string
): Promise<string> => {
  const ai = getAiClient();
  if (!ai) {
    throw new Error("Scribe assistant is currently unavailable (Missing API Key).");
  }

  const prompt = `
    You are a medieval court scribe for the Amtgard LARP organization. 
    Write a short, immersive award scroll text for a recipient named "${recipient}" 
    who is receiving the "${award}".
    
    The tone/vibe should be: ${vibe}.
    
    Keep it under 60 words. Use archaic language (e.g., "Know ye all", "Let it be known").
    Do not include the date or signature line, just the body text of the commendation.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text?.trim() || "The scribes are silent today.";
  } catch (error) {
    console.error("Error generating text:", error);
    throw new Error("The magic failed to summon the words.");
  }
};
