import { GoogleGenAI } from "@google/genai";
import { inferConceptFromPrompt } from "../src/lib/promptInference";

export default async function handler(req, res) {
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

    const inferred = inferConceptFromPrompt(customPrompt);

    const finalVehicleType = inferred.vehicleType || vehicleType;
    const finalYear = inferred.year || year;
    const finalStyle = inferred.designStyle || designStyle;
    const finalBrand = inferred.brandInspiration || brandInspiration;
    const finalAudience = inferred.targetAudience || targetAudience;
    const finalMarket = inferred.countryMarket || countryMarket;

    const prompt = `
You are AutoMuse AI, an elite automotive design mentor.

Create a futuristic vehicle concept.

Vehicle Type: ${finalVehicleType}
Year: ${finalYear}
Design Style: ${finalStyle}
Brand Inspiration: ${finalBrand}
Target Audience: ${finalAudience}
Market: ${finalMarket}

User Idea:
${customPrompt}

Return a detailed automotive concept report.
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.status(200).json({
      success: true,
      concept: result.text,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
}
