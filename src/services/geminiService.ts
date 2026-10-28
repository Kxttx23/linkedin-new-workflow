import { GoogleGenAI } from '@google/genai';
import { GEMINI_API_KEY } from '../config/env';
import { GEMINI_SYSTEM_PROMPT } from '../prompts/geminiPrompt';

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function generatePostBody(learnedToday: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite', // Or your preferred model
      contents: `System Prompt: ${GEMINI_SYSTEM_PROMPT}\n\nUser Notes: ${learnedToday}`,
    });
    console.log('Gemini API Response:', response);
    return response.text || '';
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate post body');
  }
}