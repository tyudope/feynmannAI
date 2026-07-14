import type { EvaluationResult, QuestionResult } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body = await response.json();
    if (body && typeof body.detail === "string") {
      return body.detail;
    }
  } catch {
    // Response was not JSON. Fall through to the default message below.
  }
  return "Something went wrong talking to the AI. Please try again.";
}

export async function getQuestion(topic: string): Promise<QuestionResult> {
  const response = await fetch(`${API_BASE_URL}/api/question`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic }),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response.json();
}

export async function getEvaluation(
  topic: string,
  question: string,
  explanation: string,
): Promise<EvaluationResult> {
  const response = await fetch(`${API_BASE_URL}/api/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, question, explanation }),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response.json();
}
