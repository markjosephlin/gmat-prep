import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { anthropic } from "@/lib/anthropic";
import { buildMistakeAnalysisPrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  const { questionText, userReason, imageBase64, imageMediaType } = await req.json();

  const prompt = buildMistakeAnalysisPrompt(questionText || "See the screenshot above.", userReason);

  const userContent: Anthropic.MessageParam["content"] = imageBase64
    ? [
        {
          type: "image",
          source: {
            type: "base64",
            media_type: imageMediaType ?? "image/png",
            data: imageBase64,
          },
        },
        { type: "text", text: prompt },
      ]
    : prompt;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [{ role: "user", content: userContent }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    const analysis = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ analysis });
  } catch {
    return NextResponse.json({ error: "Failed to parse analysis" }, { status: 500 });
  }
}
