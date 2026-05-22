export type GmatSection = "Quantitative" | "Verbal" | "Data Insights";

export type QuestionType =
  | "Problem Solving"
  | "Data Sufficiency"
  | "Reading Comprehension"
  | "Critical Reasoning"
  | "Multi-Source Reasoning"
  | "Table Analysis"
  | "Graphics Interpretation"
  | "Two-Part Analysis";

export type Difficulty = "easy" | "medium" | "hard";

export type MistakeCategory =
  | "Knowledge Gap"
  | "Misread"
  | "Reasoning Error"
  | "Computation"
  | "Time Pressure";

export interface AnswerChoice {
  letter: "A" | "B" | "C" | "D" | "E";
  text: string;
}

export interface Question {
  id: string;
  section: GmatSection;
  type: QuestionType;
  concept: string;
  difficulty: Difficulty;
  text: string;
  choices: AnswerChoice[];
  correct: "A" | "B" | "C" | "D" | "E";
  explanation: string;
}

export interface Mistake {
  id: string;
  user_id: string;
  question_text: string;
  user_answer: string;
  correct_answer: string;
  section: GmatSection;
  type: QuestionType;
  concept: string;
  mistake_category: MistakeCategory;
  claude_analysis: string;
  created_at: string;
}

export interface DrillAttempt {
  id: string;
  user_id: string;
  question_id: string;
  question: Question;
  user_answer: string;
  is_correct: boolean;
  time_spent_seconds: number;
  section: GmatSection;
  concept: string;
  created_at: string;
}

export interface UserStats {
  streak_days: number;
  drills_today: number;
  drills_this_week: number;
  weekly_goal: number;
  total_drills: number;
  accuracy_percent: number;
  time_spent_this_week_minutes: number;
}

export interface WeakConcept {
  concept: string;
  section: GmatSection;
  attempts: number;
  accuracy: number;
}
