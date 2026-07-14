from fastapi import HTTPException

from app.config import MAX_INPUT_CHARS


def check_input_length(*parts: str) -> None:
    total = sum(len(p) for p in parts)
    if total > MAX_INPUT_CHARS:
        raise HTTPException(
            status_code=413,
            detail=f"Input too long ({total} chars). Keep it under {MAX_INPUT_CHARS} chars.",
        )
