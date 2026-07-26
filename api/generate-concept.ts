import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from "@vercel/node";


export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is missing"
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    const {
      customPrompt = "",
      vehicleType = "Hypercar",
      year = "2075",
      designStyle = "Sci-Fi Industrial",
      brandInspiration = "Custom Atelier",
      targetAudience = "Next-Gen Commuters",
      countryMarket = "Global Metropolises",
    } = req.body || {};

    const inferred: any = {};

    const prompt = `

  

You are AutoMuse AI, an elite automotive design mentor.

Create a futuristic vehicle concept.

const finalVehicleType = (inferred as any).vehicleType || vehicleType;
const finalYear = (inferred as any).year || year;
const finalStyle = (inferred as any).designStyle || designStyle;
const finalBrand = (inferred as any).brandInspiration || brandInspiration;
const finalAudience = (inferred as any).targetAudience || targetAudience;
const finalMarket = (inferred as any).countryMarket || countryMarket;
IMPORTANT:
Return ONLY valid JSON 
Do not use Markdown
Do not use # headings
Do not add explanations before or after the JSON
Your response must start with { and end with }.

User Idea:
${customPrompt}

Return a detailed automotive concept report.
`;

    const result = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const rawText = result.text;

if (!rawText) {
  throw new Error("Gemini returned an empty response");
}

const conceptData = JSON.parse(rawText);

res.status(200).json({
  success: true,
  data: conceptData,
});

  } catch (error: any) {
    console.error("Generate concept error:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
