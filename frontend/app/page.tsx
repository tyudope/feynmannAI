"use client";

import { useEffect, useState } from "react";
import { getEvaluation, getQuestion } from "@/lib/api";
import { loadHistory, saveAttempt } from "@/lib/history";
import type { Attempt, EvaluationResult } from "@/lib/types";

type Step = "topic" | "question" | "result";

export default function HomePage() {
  const [step, setStep] = useState<Step>("topic");
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");
  const [explanation, setExplanation] = useState("");
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [history, setHistory] = useState<Attempt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Reads localStorage, which only exists in the browser, so this can't
    // run during the server render and must stay in an effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistory(loadHistory());
  }, []);

  async function handleStartTopic(event: React.FormEvent) {
    event.preventDefault();
    if (topic.trim() === "") {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const questionResult = await getQuestion(topic.trim());
      setQuestion(questionResult.question);
      setStep("question");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not load a question.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmitExplanation(event: React.FormEvent) {
    event.preventDefault();
    if (explanation.trim() === "") {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const evaluationResult = await getEvaluation(topic.trim(), question, explanation.trim());
      setResult(evaluationResult);
      setStep("result");

      const attempt: Attempt = {
        id: crypto.randomUUID(),
        topic: topic.trim(),
        question,
        explanation: explanation.trim(),
        understood: evaluationResult.understood,
      };
      setHistory(saveAttempt(attempt));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not grade your answer.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleTryAgain() {
    setExplanation("");
    setResult(null);
    setErrorMessage(null);
    setStep("question");
  }

  function handleNewTopic() {
    setTopic("");
    setQuestion("");
    setExplanation("");
    setResult(null);
    setErrorMessage(null);
    setStep("topic");
  }

  return (
    <main className="flex-1 max-w-2xl mx-auto w-full p-6 flex flex-col gap-6">
      <header className="retro-box text-center">
        <h1 className="text-4xl">FEYNMANN AI</h1>
        <p className="text-foreground-dim mt-1">
          Pick a topic. Explain it in plain words. Find out if it is really clear.
        </p>
      </header>

      {errorMessage && (
        <div className="retro-box border-accent text-accent">{errorMessage}</div>
      )}

      {step === "topic" && (
        <form onSubmit={handleStartTopic} className="retro-box flex flex-col gap-3">
          <label htmlFor="topic">What topic do you want to explain?</label>
          <input
            id="topic"
            className="retro-input"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="for example: how a fridge keeps food cold"
            maxLength={200}
            disabled={isLoading}
          />
          <button type="submit" className="retro-button self-start" disabled={isLoading}>
            {isLoading ? "Thinking..." : "Start"}
          </button>
        </form>
      )}

      {step === "question" && (
        <form onSubmit={handleSubmitExplanation} className="retro-box flex flex-col gap-3">
          <p className="text-foreground-dim">Topic: {topic}</p>
          <p className="text-accent">&quot;{question}&quot;</p>
          <label htmlFor="explanation">Answer in plain words, no big terms:</label>
          <textarea
            id="explanation"
            className="retro-input min-h-32"
            value={explanation}
            onChange={(event) => setExplanation(event.target.value)}
            maxLength={2000}
            disabled={isLoading}
          />
          <button type="submit" className="retro-button self-start" disabled={isLoading}>
            {isLoading ? "Grading..." : "Submit"}
          </button>
        </form>
      )}

      {step === "result" && result && (
        <div className="retro-box flex flex-col gap-3">
          <p className={result.understood ? "text-foreground text-xl" : "text-accent text-xl"}>
            {result.feedback}
          </p>
          <div className="text-foreground-dim">
            <p>jargon usage: {result.rubric.jargon_usage} / 10</p>
            <p>completeness: {result.rubric.completeness} / 10</p>
            <p>simplicity: {result.rubric.simplicity} / 10</p>
          </div>
          <p className="text-foreground">{result.model_explanation}</p>
          <div className="flex gap-3">
            <button type="button" className="retro-button" onClick={handleTryAgain}>
              Try Again
            </button>
            <button type="button" className="retro-button" onClick={handleNewTopic}>
              New Topic
            </button>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="retro-box">
          <p className="text-foreground-dim mb-2">Session Log</p>
          <ul className="flex flex-col gap-1">
            {history.map((attempt) => (
              <li key={attempt.id} className="text-foreground-dim">
                [{attempt.understood ? "OK" : "RETRY"}] {attempt.topic}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
