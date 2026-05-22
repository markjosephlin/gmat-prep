import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const SECTION_CONCEPTS: Record<string, string[]> = {
  Quantitative: [
    "Algebra",
    "Arithmetic",
    "Number Properties",
    "Word Problems",
    "Geometry",
    "Statistics",
    "Probability",
    "Ratios & Proportions",
    "Percentages",
    "Exponents & Roots",
  ],
  Verbal: [
    "Main Idea",
    "Inference",
    "Strengthen/Weaken",
    "Assumption",
    "Flaw",
    "Boldface",
    "Sentence Correction",
    "Parallelism",
    "Modifier Errors",
    "Verb Tense",
  ],
  "Data Insights": [
    "Data Sufficiency",
    "Table Interpretation",
    "Graph Reading",
    "Multi-Source Logic",
    "Two-Part Algebra",
    "Statistics Interpretation",
    "Percentage Change",
    "Rate Problems",
  ],
};
