import { NextResponse } from 'next/server';
import { saveEmail, initDb } from '@/lib/db';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function POST(req: Request) {
  try {
    const { prospectBio, valueProp } = await req.json();

    if (!prospectBio || !valueProp) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Initialize DB if not already
    await initDb();

    const prompt = `You are an expert sales representative. Write a highly personalized, concise, and natural-sounding cold email.
    
Prospect Background/Bio:
${prospectBio}

My Value Proposition / What I'm selling:
${valueProp}

Requirements:
- Subject line must be catchy and relevant.
- Do not use generic templates or sound like a robot.
- Find a unique angle connecting the prospect's background to the value proposition.
- Keep it under 150 words.
- Output ONLY the email (Subject: ... \n\n Body...), no extra conversational text.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash", // Or gemini-flash-lite if available, let's use standard google/gemini-2.5-flash as it's safe on OpenRouter
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedEmail = data.choices?.[0]?.message?.content || "";

    if (!generatedEmail) {
      throw new Error("Failed to generate email");
    }

    // Save to DB
    const saved = await saveEmail(prospectBio, valueProp, generatedEmail);

    return NextResponse.json({ email: saved });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
