// import { auth } from "@clerk/nextjs/server";
// // import { NextResponse } from "next/server";
// import { GoogleGenAI, Modality, Part } from "@google/genai";
// import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
// import dotenv from "dotenv";

// import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";

// import PexelsApi from "pexels-api";

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// export async function POST(req: Request) {
//   try {
//     const { userId } = await auth();
//     const body = await req.json();
//     const { prompt, amount = 1, resolution = "512x512" } = body;

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     if (!process.env.PEXELS_API_KEY) {
//       return new NextResponse("Pexels API Key not configured", { status: 500 });
//     }

//     if (!prompt) {
//       return new NextResponse("Prompt is required", { status: 400 });
//     }

//     if (!amount) {
//       return new NextResponse("Amount is required", { status: 400 });
//     }

//     if (!resolution) {
//       return new NextResponse("Resolution is required", { status: 400 });
//     }

//     const freeTrial = await checkApiLimit();

//     if (!freeTrial) {
//       return new NextResponse("Free trial has expired.", { status: 403 });
//     }

//     // Initialize the Pexels API and generate images
//     const result = await pexels.photos.search({
//       query: prompt,
//       per_page: amount,
//       size: resolution,
//     });

//     await increaseApiLimit();

//     console.log("API Result:", result);
//     console.log("API Result Photos:", result.photos);

//     const imageUrls = result.photos.map((photo: any) => photo.src.original);

//     return NextResponse.json({ imageUrls });
//   } catch (error: unknown) {
//     console.log("[IMAGE_ERROR]", error);

//     if (error instanceof Error) {
//       return new NextResponse(`Pexels API Error: ${error.message}`, {
//         status: 500,
//       });
//     }

//     return new NextResponse("Internal error", { status: 500 });
//   }
// }

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
