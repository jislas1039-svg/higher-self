
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, WorkoutDay, MealRecommendation } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Generates the initial holistic plan. 
 * Optimizes speed by disabling thinking budget.
 */
export async function generatePersonalizedPlan(profile: UserProfile) {
  const prompt = `
    Create a 7-day holistic fitness/wellness plan for ${profile.name}.
    Level: ${profile.experienceLevel}. Goals: ${profile.goals.join(', ')}.
    Body: ${profile.bodyType}. Focus: ${profile.fatFocusAreas.join(', ')}.

    CRITICAL REQUIREMENTS:
    1. For EVERY exercise, provide "Evidence": A 1-2 sentence hard scientific fact or physiological reason why this movement is proven to help the specific goal (e.g. "Mechanical tension triggers sarcoplasmic hypertrophy" or "Poliometric strides increase VO2 max efficiency").
    2. Cite a brief reference or article title under "articleLink" (e.g., "Journal of Strength & Conditioning Research" or "The Science of Hypertrophy").
    3. Calibrate intensity: Beginners (Form focus), Intermediate (Volume), Pro (Intensity/Advanced Splits).
    4. If Running: Include splits, long runs, strides, and pre/post running stretches.
    5. If Flexibility: Include a split-progression stretching ritual.
    6. If Bulking: Focus on progressive overload strength training.
    
    Avoid special characters like ### or **. Tone: High-performance, human-like, authoritative.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }, 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            schedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  focus: { type: Type.STRING },
                  isRest: { type: Type.BOOLEAN },
                  exercises: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        reps: { type: Type.STRING },
                        description: { type: Type.STRING },
                        category: { type: Type.STRING },
                        evidence: { type: Type.STRING },
                        articleLink: { type: Type.STRING }
                      },
                      required: ["name", "reps", "description", "category", "evidence", "articleLink"]
                    }
                  }
                },
                required: ["day", "focus", "isRest", "exercises"]
              }
            },
            meals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  alternative: { type: Type.STRING },
                  recipeName: { type: Type.STRING },
                  ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                  macros: {
                    type: Type.OBJECT,
                    properties: {
                      calories: { type: Type.NUMBER },
                      protein: { type: Type.NUMBER },
                      carbs: { type: Type.NUMBER },
                      fat: { type: Type.NUMBER }
                    }
                  }
                }
              }
            },
            journalPrompts: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            introduction: { type: Type.STRING }
          },
          required: ["schedule", "meals", "journalPrompts", "introduction"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating plan:", error);
    return null;
  }
}

export async function generateIntimatePrompts(responses: Record<string, string>) {
  const prompt = `
    User Responses for shift assessment:
    - Public resilience: "${responses.embarrassment}"
    - Friendships: "${responses.friendships}"
    - Love: "${responses.love}"
    - Purpose: "${responses.fitnessMotivation}"
    - Energy: "${responses.introversion}"

    Generate 5 deep, intimate journal prompts for inner self healing. 
    Tone: Therapeutic, human, soulful. Return only JSON array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 2000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating intimate prompts:", error);
    return null;
  }
}

export async function analyzeFoodImage(base64Image: string, goals: string[]) {
  const prompt = `
    Analyze food/label. User goals: ${goals.join(', ')}.
    Identify name, macros, rating (green/yellow/red), ingredient highlights, and "Higher Self" verdict.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { text: prompt },
        { inlineData: { mimeType: "image/jpeg", data: base64Image.split(',')[1] } }
      ],
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            itemName: { type: Type.STRING },
            macros: {
              type: Type.OBJECT,
              properties: {
                calories: { type: Type.STRING },
                protein: { type: Type.STRING },
                carbs: { type: Type.STRING },
                fat: { type: Type.STRING }
              }
            },
            rating: { type: Type.STRING },
            ingredientsAnalysis: { type: Type.ARRAY, items: { type: Type.STRING } },
            verdict: { type: Type.STRING }
          },
          required: ["itemName", "macros", "rating", "ingredientsAnalysis", "verdict"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error analyzing food:", error);
    return null;
  }
}

export async function generateExerciseGraphic(exerciseName: string, description: string) {
  try {
    const aiImage = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await aiImage.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Minimalist, high-quality fitness sketch of ${exerciseName}. ${description}. Soft sage/neutral colors. Plain background. Functional form focus.`,
          },
        ],
      },
      config: {
        imageConfig: { aspectRatio: "1:1" }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating exercise image:", error);
    return null;
  }
}

export async function generateNewJournalPrompt(history: string[]) {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Based on: ${history.slice(-3).join('. ')}. Generate one deep Higher Self journal prompt.`,
        config: { thinkingConfig: { thinkingBudget: 0 } }
    });
    return response.text;
}

export async function generateCustomAlternative(craving: string, dietaryRestrictions: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Transform craving: "${craving}" (Restrictions: ${dietaryRestrictions}) into healthy alternative using kitchen basics.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recipeName: { type: Type.STRING },
            philosophy: { type: Type.STRING },
            basicIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            extraAddOns: { type: Type.ARRAY, items: { type: Type.STRING } },
            instructions: { type: Type.STRING },
            macros: {
              type: Type.OBJECT,
              properties: {
                calories: { type: Type.NUMBER },
                protein: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER },
                fat: { type: Type.NUMBER }
              }
            }
          },
          required: ["recipeName", "philosophy", "basicIngredients", "extraAddOns", "instructions", "macros"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating craving transformation:", error);
    return null;
  }
}
