import type { GmatSection, QuestionType, Difficulty } from "@/types";

export function buildQuestionPrompt(
  section: GmatSection,
  type: QuestionType,
  concept: string,
  difficulty: Difficulty
): string {
  return `You are an expert GMAT question writer. Generate a single ${difficulty} difficulty ${section} question of type "${type}" that tests the concept: "${concept}".

Requirements:
- The question must be realistic and match official GMAT style
- For Data Sufficiency questions, use the standard two-statement format with answer choices A-E
- Provide exactly 5 answer choices (A-E) unless it's a Two-Part Analysis
- The explanation should identify the key concept and strategy, not just state the answer

Respond with ONLY valid JSON in this exact format:
{
  "section": "${section}",
  "type": "${type}",
  "concept": "${concept}",
  "difficulty": "${difficulty}",
  "text": "question text here",
  "choices": [
    {"letter": "A", "text": "answer A"},
    {"letter": "B", "text": "answer B"},
    {"letter": "C", "text": "answer C"},
    {"letter": "D", "text": "answer D"},
    {"letter": "E", "text": "answer E"}
  ],
  "correct": "A",
  "explanation": "Step-by-step explanation using **bold** for key labels like **Key Concept & Strategy:**, **Step 1:**, **Step 2:**, **The answer is X.**, and **Common Trap:** so they stand out."
}`;
}

export function buildExplanationPrompt(
  questionText: string,
  choices: { letter: string; text: string }[],
  userAnswer: string,
  correctAnswer: string,
  concept: string
): string {
  const choicesText = choices
    .map((c) => `${c.letter}. ${c.text}`)
    .join("\n");

  return `A student is practicing GMAT questions and got this one wrong.

QUESTION:
${questionText}

CHOICES:
${choicesText}

Student answered: ${userAnswer}
Correct answer: ${correctAnswer}
Concept being tested: ${concept}

Please provide:
1. A clear explanation of why ${correctAnswer} is correct (2-3 sentences)
2. Why ${userAnswer} is wrong (1-2 sentences)
3. The key strategy or rule to remember for this concept (1-2 sentences)
4. The likely mistake category from: Knowledge Gap, Misread, Reasoning Error, Computation, Time Pressure

Respond with JSON:
{
  "why_correct": "Use **bold** for key labels like **Why A is correct:** and any critical terms.",
  "why_wrong": "Use **bold** for key labels like **Why your answer was wrong:** and any critical terms.",
  "strategy": "Use **bold** for the rule or key phrase to remember.",
  "mistake_category": "..."
}`;
}

export function buildMistakeAnalysisPrompt(
  questionText: string,
  userReason: string
): string {
  return `A GMAT student got this question wrong and wants to understand their weakness.

QUESTION THEY MISSED:
${questionText}

THEIR EXPLANATION OF WHY THEY MISSED IT:
${userReason}

Analyze this and respond with JSON:
{
  "section": "Quantitative" | "Verbal" | "Data Insights",
  "type": "Problem Solving" | "Data Sufficiency" | "Reading Comprehension" | "Critical Reasoning" | "Multi-Source Reasoning" | "Table Analysis" | "Graphics Interpretation" | "Two-Part Analysis",
  "concept": "the specific micro-concept being tested (e.g., 'Remainders', 'Assumption', 'Percentage Change')",
  "mistake_category": "Knowledge Gap" | "Misread" | "Reasoning Error" | "Computation" | "Time Pressure",
  "analysis": "2-3 sentence explanation of the specific gap and what to practice",
  "drill_focus": "One sentence describing what the generated drills should target"
}`;
}
