
import { GoogleGenAI, Type, Modality, Chat } from "@google/genai";
import { v4 as uuidv4 } from 'uuid'; // A temporary measure until the model can generate IDs

if (!process.env.GEMINI_API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ScheduleEvent {
    id: string;
    time: string;
    title: string;
    description: string;
}

export interface ScheduleDay {
    day: string;
    events: ScheduleEvent[];
}

export type ScheduleData = ScheduleDay[];

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve(''); // Should not happen with readAsDataURL
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const detectLanguage = async (prompt: string): Promise<string> => {
    if (!prompt.trim()) {
        return 'English'; // Default for empty prompts
    }
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are a language detection expert. Analyze the following text and identify the language it is written in. Respond with ONLY the name of the language (e.g., "English", "Russian", "Spanish"). Do not add any other words, punctuation, or explanation.`;
    
    try {
        const response = await ai.models.generateContent({
            model,
            contents: { parts: [{ text: prompt }] },
            config: {
                systemInstruction,
                thinkingConfig: { thinkingBudget: 0 }
            },
        });
        const detectedLang = response.text.trim();
        if (detectedLang && detectedLang.length < 25) { 
            return detectedLang;
        }
        return 'English'; // Fallback if response is unusual
    } catch (error) {
        console.error("Language detection failed:", error);
        return 'English'; // Fallback on API error
    }
};

export const solveHomework = async (prompt: string, imageFile: File | null, fallbackLanguage: string): Promise<string> => {
  const model = 'gemini-2.5-flash';
  const languageToUse = prompt 
    ? await detectLanguage(prompt) 
    : (fallbackLanguage === 'ru' ? 'Russian' : 'English');

  const languageInstruction = `Your response MUST be in ${languageToUse}.`;
  const systemInstruction = `You are an AI assistant designed to help students with their homework.
${languageInstruction}
Your response MUST be in Markdown format and follow this structure:
1.  **Answer:** Start your response immediately with the direct answer to the user's question. Do not add any introductory phrases or conversational filler.
2.  **Explanation:** After providing the answer, give a detailed, step-by-step explanation of how to reach that solution.
Use Markdown for headings, lists, and bold text (e.g., **text**).

**Graphing Instructions:**
If the problem is mathematical and a graph or chart would help in the explanation (e.g., plotting functions, visualizing data), generate a Vega-Lite JSON specification for the visual.
- Enclose the Vega-Lite JSON within a Markdown code block labeled \`json vega-lite\`.
- Example:
\`\`\`json vega-lite
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "description": "A simple bar chart.",
  "data": {
    "values": [
      {"a": "A","b": 28}, {"a": "B","b": 55}, {"a": "C","b": 43}
    ]
  },
  "mark": "bar",
  "encoding": {
    "x": {"field": "a", "type": "ordinal"},
    "y": {"field": "b", "type": "quantitative"}
  }
}
\`\`\`

If the user's question is ambiguous, ask for clarification. Your tone should be direct, helpful, and educational.`;
  
  const contents = [];
  
  if (imageFile) {
    const imagePart = await fileToGenerativePart(imageFile);
    contents.push(imagePart);
  }

  if (prompt) {
    contents.push({ text: prompt });
  } else if (imageFile) {
    // Add a default prompt if only an image is provided
    contents.push({ text: "Please analyze and solve the problem shown in the image." });
  }

  if (contents.length === 0) {
    throw new Error("No prompt or image provided.");
  }

  const response = await ai.models.generateContent({
    model,
    contents: { parts: contents },
    config: {
      systemInstruction: systemInstruction,
    },
  });

  return response.text;
};

export const createCheatSheet = async (solutionText: string, contextPrompt: string): Promise<string> => {
    const model = 'gemini-2.5-flash';
    const detectedLanguage = await detectLanguage(contextPrompt);
    const languageInstruction = `Your response MUST be in ${detectedLanguage}.`;
    const systemInstruction = `You are an AI assistant that creates concise cheat sheets from the provided text.
${languageInstruction}
Your goal is to summarize the key points, important formulas, and core concepts into an easy-to-read format.
Use Markdown for formatting, including bullet points and bold text for emphasis.
The output MUST be in Markdown format.`;

    const response = await ai.models.generateContent({
        model,
        contents: { parts: [{ text: solutionText }] },
        config: {
            systemInstruction,
        },
    });

    return response.text;
};

export const generatePracticeProblems = async (originalPrompt: string, solutionText: string): Promise<string> => {
    const model = 'gemini-2.5-flash';
    const detectedLanguage = await detectLanguage(originalPrompt);
    const languageInstruction = `Your response MUST be in ${detectedLanguage}.`;
    const systemInstruction = `You are an AI assistant that generates practice problems based on a provided example.
${languageInstruction}
Your goal is to create 2-3 problems that are similar in concept and difficulty to the original problem.
The problems should help a student solidify their understanding.
The output MUST be in Markdown format. Number the problems.`;

    const fullPrompt = `Based on the original question and its solution, please generate some practice problems.

Original Question: "${originalPrompt}"

Solution:
${solutionText}

Now, create 2-3 similar practice problems.`;

    const response = await ai.models.generateContent({
        model,
        contents: { parts: [{ text: fullPrompt }] },
        config: {
            systemInstruction,
        },
    });

    return response.text;
};

export const generateSketch = async (prompt: string): Promise<string> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `A clean, simple, educational sketch or diagram of the following concept: ${prompt}. The style should be like a clear textbook illustration, possibly with a white background.`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages[0].image.imageBytes;
    }

    throw new Error('Image generation failed. No images were returned.');
};

export const editSketch = async (base64ImageData: string, prompt: string): Promise<string> => {
  const imagePart = {
    inlineData: {
      data: base64ImageData,
      mimeType: 'image/jpeg',
    },
  };

  const textPart = {
    text: prompt,
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image-preview',
    contents: {
      parts: [imagePart, textPart],
    },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return part.inlineData.data;
    }
  }

  throw new Error('Image editing failed. No edited image was returned.');
};


export const generateSchedule = async (prompt: string): Promise<ScheduleData> => {
    const model = 'gemini-2.5-flash';
    const detectedLanguage = await detectLanguage(prompt);
    const languageInstruction = `Your response MUST be in ${detectedLanguage}. For days of the week, use the full name (e.g., Monday, Tuesday in English; Понедельник, Вторник in Russian).`;
    const systemInstruction = `You are an AI assistant that creates daily or weekly schedules.
${languageInstruction}
Based on the user's prompt, generate a structured schedule.
The output must be a valid JSON object that adheres to the provided schema.
Organize events logically throughout the days requested. Be specific with times and descriptions.
Each event must have a unique 'id'. You can use a simple counter for this (e.g., "event-1", "event-2").
If the user mentions a week, create a schedule for Monday through Sunday unless specified otherwise.`;
    
    const response = await ai.models.generateContent({
        model,
        contents: { parts: [{ text: prompt }] },
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        day: {
                            type: Type.STRING,
                            description: "The day of the week (e.g., Monday, Tuesday)."
                        },
                        events: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: {
                                        type: Type.STRING,
                                        description: "A unique identifier for the event (e.g., 'event-1')."
                                    },
                                    time: {
                                        type: Type.STRING,
                                        description: "The time for the event (e.g., '9:00 AM - 10:30 AM')."
                                    },
                                    title: {
                                        type: Type.STRING,
                                        description: "A concise title for the event."
                                    },
                                    description: {
                                        type: Type.STRING,
                                        description: "A brief description of the event or task."
                                    }
                                },
                                required: ["id", "time", "title", "description"]
                            }
                        }
                    },
                    required: ["day", "events"]
                }
            }
        },
    });
    
    try {
        const jsonText = response.text.trim();
        // Fallback: If the model fails to generate IDs, add them manually.
        const parsedSchedule: ScheduleData = JSON.parse(jsonText);
        parsedSchedule.forEach(day => {
            day.events.forEach(event => {
                if (!event.id) {
                    event.id = `event-${Math.random().toString(36).substr(2, 9)}`;
                }
            });
        });
        return parsedSchedule;

    } catch (e) {
        console.error("Failed to parse schedule JSON:", e);
        throw new Error("The AI returned an invalid schedule format. Please try again.");
    }
};

export const startTutorChat = (languageName: string): Chat => {
    const model = 'gemini-2.5-flash';
    const languageInstruction = `Your response MUST be in ${languageName}.`;
    const systemInstruction = `You are a friendly and encouraging AI tutor named Gemini.
${languageInstruction}
Your goal is to help students understand complex topics by breaking them down into simple, easy-to-understand explanations.
- Do not just give away the answers. Guide the student towards the solution by asking leading questions.
- Use analogies and real-world examples to make concepts relatable.
- Ask questions to check for the student's understanding.
- Keep your responses concise and conversational.
- Use Markdown for formatting like lists, bold text, and code snippets when appropriate.`;
    
    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction,
      },
    });
    return chat;
  };
