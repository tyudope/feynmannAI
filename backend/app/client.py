import json

from anthropic import Anthropic

from app.config import ANTHROPIC_API_KEY, ANTHROPIC_MODEL, MAX_OUTPUT_TOKENS

_client = Anthropic(api_key=ANTHROPIC_API_KEY)


def call_model(system: str, user_message: str, json_response: bool = False) -> str:
    message = _client.messages.create(
        model=ANTHROPIC_MODEL,
        max_tokens=MAX_OUTPUT_TOKENS,
        system=system,
        messages=[{"role": "user", "content": user_message}],
    )
    text = message.content[0].text.strip()
    if json_response:
        # Model may wrap JSON in a code fence; strip it if present.
        text = text.removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    return text


def call_model_json(system: str, user_message: str) -> dict:
    return json.loads(call_model(system, user_message, json_response=True))
