import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { buildQuestionPrompt } from "@/lib/prompts";
import type { GmatSection, QuestionType, Difficulty } from "@/types";

export async function POST(req: NextRequest) {
  const { section, type, concept, difficulty } = await req.json();

  const prompt = buildQuestionPrompt(
    section as GmatSection,
    type as QuestionType,
    concept,
    difficulty as Difficulty
  );

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    const question = JSON.parse(jsonMatch[0]);
    if (!question.choices || !Array.isArray(question.choices)) {
      throw new Error("Invalid question format");
    }
    return NextResponse.json({ question });
  } catch (e) {
    console.error("generate-question error:", e, "raw response:", text);
    return NextResponse.json({ error: "Failed to parse question" }, { status: 500 });
  }
}
