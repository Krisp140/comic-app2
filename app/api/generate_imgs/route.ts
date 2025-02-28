import { NextResponse } from 'next/server';
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    console.log("Running the model...");
    const output = await replicate.run(
      "krisp140/cody:a6344ea6938752e55acff4fb8cb9f852c54b0fef7795aaf66361eba1b1b147cd",
      {
        input: {
          prompt: prompt,
          num_inference_steps: 28,
          model: "dev",
          guidance_scale: 10
        }
      }
    );

    // Return the generated image URL
    const img_url = String(output);
    return NextResponse.json({ imageUrl: img_url });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
} 