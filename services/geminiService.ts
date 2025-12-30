
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { LessonSource } from "../types";

// Always use a named parameter for apiKey and use process.env.API_KEY directly.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateLessonContent(grade: number, subject: string, topic: string, language: string = 'Bengali') {
  const ai = getAI();
  const prompt = `Create a fun, educational reading lesson for grade ${grade} students about "${topic}" in ${subject}. 
  The content should be written in ${language}. 
  
  Use Google Search to find the most accurate and up-to-date information.
  
  Please format your response exactly like this:
  TITLE: [The Catchy Title]
  CONTENT: [3-4 short paragraphs of engaging educational text suitable for children]
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  // Extract text safely using the .text property
  const text = response.text || "";
  const titleMatch = text.match(/TITLE:\s*(.*)/i);
  const contentMatch = text.match(/CONTENT:\s*([\s\S]*)/i);

  const title = titleMatch ? titleMatch[1].trim() : "Educational Lesson";
  const content = contentMatch ? contentMatch[1].trim() : text;

  // Extract grounding sources from groundingMetadata
  const sources: LessonSource[] = [];
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (groundingChunks) {
    groundingChunks.forEach((chunk: any) => {
      if (chunk.web && chunk.web.uri) {
        sources.push({
          uri: chunk.web.uri,
          title: chunk.web.title || chunk.web.uri
        });
      }
    });
  }

  // Remove duplicates
  const uniqueSources = sources.filter((v, i, a) => a.findIndex(t => (t.uri === v.uri)) === i);

  return { title, content, sources: uniqueSources };
}

export async function generateLessonImage(lessonTitle: string, lessonContent: string) {
  const ai = getAI();
  
  const visualPrompt = `
    High-quality, professional digital illustration for a children's textbook. 
    Subject: ${lessonTitle}. 
    Style: Vibrant 3D digital art, cute characters, bright soft lighting, educational and friendly. 
    Technical requirements: 
    - 4k resolution feel, extremely clear and clean.
    - NO text in the image. 
    - NO distorted faces or limbs. 
    - Focused on the main subject of ${lessonTitle}.
    - Context: ${lessonContent.substring(0, 150)}...
    - Masterpiece quality, simple and engaging for kids aged 3-7.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: visualPrompt }]
    },
    config: {
      imageConfig: { 
        aspectRatio: "16:9"
      }
    }
  });

  // Iterate over parts to find the image part
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }
  return null;
}

export async function generateSpeech(text: string, voiceName: 'Kore' | 'Puck' = 'Kore') {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName },
        },
      },
    },
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
}

export async function generateQuiz(lessonContent: string, language: string = 'Bengali') {
  const ai = getAI();
  const prompt = `Based on the following lesson content, generate 5 multiple-choice questions for grade school children in ${language}. 
  Return as a JSON array of objects.
  
  Content: ${lessonContent}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.INTEGER, description: "Index of correct option (0-3)" }
          },
          required: ["question", "options", "correctAnswer"]
        }
      }
    }
  });

  // Use the .text property directly and handle potential undefined
  return JSON.parse(response.text || '[]');
}
