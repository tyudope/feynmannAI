# FEYNMANN AI

## Description

An AI-powered Feynman Technique practice tool. The user picks a topic; the AI responds
like a curious child asking a narrow, specific question about it (e.g. "hey, could you
explain this part to me?"). The user answers in plain language, avoiding jargon and
complex vocabulary. The AI grades the explanation against a rubric and returns feedback
in one of two tones: an encouraging "You have surely understood this" or a constructive
"Unfortunately this isn't crystal clear yet, you should work on this a bit" — plus the
specific rubric feedback backing that verdict.

### Scoring

Rubric-based, multiple dimensions combined into one overall verdict, e.g.:
- **Jargon usage** — did the user lean on technical terms instead of plain language?
- **Completeness** — does the explanation actually answer the AI's question?
- **Simplicity** — could a non-expert (or a child) follow it?

Each dimension gets a short score; the combined result decides the pass/needs-work
feedback and drives what specific coaching the AI includes in its response.

### State

No database, and no server-side session state. Each request is stateless on the backend.
Any history of past attempts/topics is kept client-side only (in-memory or
localStorage) — nothing survives a page reload beyond what the browser holds.

## Design Language

70s/80s retro. Avoid unnecessary animations — keep it minimal and manual, as if this
app were built on 80s-era machines.

## Frameworks

- Backend files live in `backend/`, frontend files live in `frontend/`.
- Backend: FastAPI, Pydantic, Python.
- Frontend: Next.js.
- No database — see State above.

## AI

- Provider: Anthropic API, Claude Sonnet 5.
- Target cost: ~$0.10 max per call.
- Guardrails, enforced two ways:
  1. **Hard token caps** — small `max_tokens` on the completion, and a capped input
     length passed to the model.
  2. **Pre-flight length check** — backend estimates the request's input length before
     calling the API and rejects with a friendly error if it would exceed the cost
     budget, instead of relying on the API call itself to fail or overrun cost.
- System prompt: written as a single, tightly structured prompt (topic question style,
  scoring rubric, response tone) rather than assembled from free-form pieces.
- Validation: Pydantic schemas validate both directions —
  - user request (topic, explanation text) before it's sent to the model,
  - the model's response (rubric scores + verdict + feedback) before it's returned to
    the frontend, so a malformed/hallucinated model response can't leak through.
- Add `.env.example` documenting required env vars (API key, etc.) — no real secrets
  committed.
