from fastapi import HTTPException, status
import re


def validate_password(password: str):
    if len(password) < 6:
        raise HTTPException(400, "Password too short")

    if not re.search(r"[A-Z]", password):
        raise HTTPException(400, "Password must contain uppercase letter")

    if not re.search(r"[!@#$%^&*]", password):
        raise HTTPException(400, "Password must contain special character")
