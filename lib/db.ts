import { createClient } from "@/lib/supabase";
import type { GmatSection, Question, WeakConcept } from "@/types";

export async function saveMistake({
  userId,
  questionText,
  section,
  type,
  concept,
  mistakeCategory,
  claudeAnalysis,
  drillFocus,
}: {
  userId: string;
  questionText: string;
  section: string;
  type: string;
  concept: string;
  mistakeCategory: string;
  claudeAnalysis: string;
  drillFocus: string;
}) {
  const supabase = createClient();
  const { error } = await supabase.from("mistakes").insert({
    user_id: userId,
    question_text: questionText,
    section,
    type,
    concept,
    mistake_category: mistakeCategory,
    claude_analysis: claudeAnalysis,
    drill_focus: drillFocus,
  });
  if (error) console.error("saveMistake error:", error);
}

export async function saveDrillAttempt({
  userId,
  question,
  userAnswer,
  correctAnswer,
  isCorrect,
  section,
  concept,
}: {
  userId: string;
  question: Question;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  section: string;
  concept: string;
}) {
  const supabase = createClient();
  const { error } = await supabase.from("drill_attempts").insert({
    user_id: userId,
    question,
    user_answer: userAnswer,
    correct_answer: correctAnswer,
    is_correct: isCorrect,
    section,
    concept,
  });
  if (error) console.error("saveDrillAttempt error:", error);
}

export async function getWeakConcepts(userId: string): Promise<WeakConcept[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("drill_attempts")
    .select("concept, section, is_correct")
    .eq("user_id", userId);

  if (error || !data || data.length === 0) return [];

  const map: Record<string, { section: GmatSection; correct: number; total: number }> = {};
  for (const row of data) {
    if (!map[row.concept]) {
      map[row.concept] = { section: row.section, correct: 0, total: 0 };
    }
    map[row.concept].total++;
    if (row.is_correct) map[row.concept].correct++;
  }

  return Object.entries(map)
    .map(([concept, { section, correct, total }]) => ({
      concept,
      section,
      attempts: total,
      accuracy: Math.round((correct / total) * 100),
    }))
    .sort((a, b) => a.accuracy - b.accuracy);
}

export async function getMistakeConcepts(userId: string): Promise<{ concept: string; section: string }[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("mistakes")
    .select("concept, section")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !data) return [];
  return data;
}

export async function getDrillHistory(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("drill_attempts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return [];
  return data ?? [];
}

export async function getDrillStats(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("drill_attempts")
    .select("is_correct, created_at")
    .eq("user_id", userId);

  if (error || !data) return { total: 0, correct: 0, todayCount: 0, weekCount: 0 };

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);

  let correct = 0;
  let todayCount = 0;
  let weekCount = 0;

  for (const row of data) {
    if (row.is_correct) correct++;
    const d = new Date(row.created_at);
    if (d >= todayStart) todayCount++;
    if (d >= weekStart) weekCount++;
  }

  return { total: data.length, correct, todayCount, weekCount };
}
