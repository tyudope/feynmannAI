export type RubricScore = {
  jargon_usage: number;
  completeness: number;
  simplicity: number;
};

export type QuestionResult = {
  question: string;
};

export type EvaluationResult = {
  understood: boolean;
  rubric: RubricScore;
  feedback: string;
};

export type Attempt = {
  id: string;
  topic: string;
  question: string;
  explanation: string;
  understood: boolean;
};
