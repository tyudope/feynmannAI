from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError

from app.client import call_model, call_model_json
from app.guardrails import check_input_length
from app.prompts import QUESTION_SYSTEM_PROMPT, SYSTEM_PROMPT, build_user_message
from app.schemas import (
    ExplainRequest,
    ExplainResponse,
    QuestionRequest,
    QuestionResponse,
)

app = FastAPI(title="feynmannAI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/question", response_model=QuestionResponse)
def ask_question(payload: QuestionRequest) -> QuestionResponse:
    check_input_length(payload.topic)
    question = call_model(QUESTION_SYSTEM_PROMPT, f"Topic: {payload.topic}")
    return QuestionResponse(question=question)


@app.post("/api/evaluate", response_model=ExplainResponse)
def evaluate(payload: ExplainRequest) -> ExplainResponse:
    check_input_length(payload.topic, payload.question, payload.explanation)
    user_message = build_user_message(payload.topic, payload.question, payload.explanation)
    raw = call_model_json(SYSTEM_PROMPT, user_message)
    try:
        return ExplainResponse.model_validate(raw)
    except ValidationError as exc:
        raise ValueError(f"Model returned an invalid response: {exc}") from exc
