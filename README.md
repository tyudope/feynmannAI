# feynmannAI

Practice the Feynman Technique against an AI that acts like a curious kid.
You pick a topic, it asks you one narrow question about it, you answer in
plain language, and it grades whether you actually explained it or just
hid behind jargon.

## How it works

1. **Pick a topic.** Anything — TCP handshakes, photosynthesis, why the sky
   is blue.
2. **Get asked a question.** The AI plays a curious child and asks one
   specific thing about your topic, e.g. "wait, but why does that part
   happen?"
3. **Explain it back.** No jargon, no fancy vocabulary — explain it like
   you'd explain it to an actual kid.
4. **Get graded.** The AI scores your explanation on jargon, completeness,
   and simplicity, gives you a verdict in the same curious-kid voice, and
   shows you its own version of a clear answer so you have something to
   compare against.

| Topic screen | Question / answer screen | Result screen |
| --- | --- | --- |
| ![Topic screen](screenshots/01-topic.png) | ![Question and answer screen](screenshots/02-question.png) | ![Result screen](screenshots/03-result.png) |

## Scoring

Three dimensions, each scored 0-10:

- **Jargon usage** — did you lean on technical terms instead of explaining
  in plain language?
- **Completeness** — did you actually answer the question that was asked?
- **Simplicity** — could a non-expert follow this?

You only get an "understood" verdict if all three dimensions score 7+.
Otherwise you get honest, specific feedback on what to fix.

## Stack

- **Backend** — FastAPI + Pydantic, Python. Two endpoints:
  - `POST /api/question` — topic in, curious-child question out.
  - `POST /api/evaluate` — topic + question + explanation in, rubric
    scores + verdict + feedback + model explanation out.
- **Frontend** — Next.js (App Router, TypeScript, Tailwind). One page
  driving the topic → question → result flow, with an `lib/api.ts` client
  and a `lib/history.ts` localStorage log.
- **AI** — Anthropic API, Claude Sonnet 5. Kept cheap and safe on purpose:
  - hard `max_tokens` cap on the completion
  - capped input length on every request field (backend rejects oversized
    input before it ever reaches the model)
  - one tightly-written system prompt per endpoint (`backend/app/prompts.py`)
  - Pydantic validates both directions — your input before it's sent, and
    the model's response before it's returned — so a malformed model
    response can't leak through to the frontend.

No database, no server-side sessions. Every request is stateless on the
backend; whatever history you see in the UI lives only in your browser's
localStorage and disappears on a hard reset.

## Design

70s/80s retro terminal look: black background, green text, amber accents,
VT323 monospace font, thick square borders. No rounded corners, no
transitions, no animations — built to feel like it's running on old
hardware.

## Running it locally

**Backend**

```bash
cd backend
cp .env.example .env   # add your ANTHROPIC_API_KEY
./.venv/bin/uvicorn app.main:app --port 8000
```

**Frontend**

```bash
cd frontend
npm install
npm run dev             # defaults to http://localhost:8000 for the API
```

Point the frontend at a different backend with `NEXT_PUBLIC_API_BASE_URL`
in `frontend/.env.local` (see `.env.local.example`).
