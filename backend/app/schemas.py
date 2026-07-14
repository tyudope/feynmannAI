from pydantic import BaseModel, Field

from app.config import MAX_INPUT_CHARS


class QuestionRequest(BaseModel):
    topic: str = Field(min_length=1, max_length=200)


class QuestionResponse(BaseModel):
    question: str = Field(min_length=1, max_length=300)


class ExplainRequest(BaseModel):
    topic: str = Field(min_length=1, max_length=200)
    question: str = Field(min_length=1, max_length=500)
    explanation: str = Field(min_length=1, max_length=MAX_INPUT_CHARS)


class RubricScore(BaseModel):
    jargon_usage: int = Field(ge=0, le=10)
    completeness: int = Field(ge=0, le=10)
    simplicity: int = Field(ge=0, le=10)


class ExplainResponse(BaseModel):
    understood: bool
    rubric: RubricScore
    feedback: str = Field(min_length=1, max_length=800)
    model_explanation: str = Field(min_length=1, max_length=800)
