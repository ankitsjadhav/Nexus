import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { GoogleGenAI, Modality, Part } from "@google/genai";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { prompt } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return new NextResponse("Gemini API Key not configured", { status: 500 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();

    if (!freeTrial) {
      return new NextResponse("Free trial has expired.", { status: 403 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    const parts: Part[] = response.candidates?.[0]?.content?.parts || [];

    const images: string[] = [];

    for (const part of parts) {
      if ("inlineData" in part && part.inlineData?.data) {
        const imageData = part.inlineData.data;
        images.push(`data:image/png;base64,${imageData}`);
      }
    }

    await increaseApiLimit();

    return NextResponse.json({ imageUrls: images });
  } catch (error: unknown) {
    console.log("[GEMINI_IMAGE_ERROR]", error);

    if (error instanceof Error) {
      return new NextResponse(`Gemini API Error: ${error.message}`, {
        status: 500,
      });
    }

    return new NextResponse("Internal error", { status: 500 });
  }
}
