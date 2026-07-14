import os

from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY = os.environ["ANTHROPIC_API_KEY"]
ANTHROPIC_MODEL = os.environ.get("ANTHROPIC_MODEL", "claude-sonnet-5")

# Cost guardrail: keep a single call under ~$0.10.
MAX_INPUT_CHARS = 2000
MAX_OUTPUT_TOKENS = 550
