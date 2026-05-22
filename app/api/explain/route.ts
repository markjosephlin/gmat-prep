import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { buildExplanationPrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  const { questionText, choices, userAnswer, correctAnswer, concept } = await req.json();

  const prompt = buildExplanationPrompt(questionText, choices, userAnswer, correctAnswer, concept);

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";

  try {
    const explanation = JSON.parse(text);
    return NextResponse.json({ explanation });
  } catch {
    return NextResponse.json({ error: "Failed to parse explanation" }, { status: 500 });
  }
}
