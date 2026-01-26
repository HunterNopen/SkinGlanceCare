import email
import httpx
from ssl import create_default_context
from email.mime.text import MIMEText
from backend.config import (
    FRONTEND_RESET_PASSWORD_URL,
    MAIL_HOST,
    MAIL_PORT,
    MAIL_USERNAME,
    MAIL_PASSWORD,
    MAIL_FROM,
    BREVO_API_URL,
)
from backend.db.schemas import MailBody


def send_via_brevo_api(to_email: str, subject: str, html_content: str):
    headers = {
        "accept": "application/json",
        "api-key": MAIL_PASSWORD,
        "content-type": "application/json",
    }

    payload = {
        "sender": {"email": MAIL_FROM, "name": "Your App Name"},
        "to": [{"email": to_email}],
        "subject": subject,
        "htmlContent": html_content,
    }

    with httpx.Client() as client:
        response = client.post(BREVO_API_URL, headers=headers, json=payload)
        if response.status_code >= 400:
            response.raise_for_status()
    return response


def send_verification_email(email: str, code: str):
    subject = "Verify your email"
    body = f"<p>Your code: <b>{code}</b></p>"
    return send_via_brevo_api(email, subject, body)


def send_reset_password_email(email: str, token: str):
    subject = "Reset your password"
    body = (
        f"<p>You requested a password reset. Click this link to reset your password: "
        f"<b>{FRONTEND_RESET_PASSWORD_URL}?token={token}</b></p>"
        f"<p>This link is valid for 10 minutes.</p>"
    )
    return send_via_brevo_api(email, subject, body)


def send_contact_email(from_email: str, message: str):
    subject = "New contact form message"

    body = f"""
    <h3>New message from contact form</h3>
    <p><b>From:</b> {from_email}</p>
    <p><b>Message:</b></p>
    <p>{message}</p>
    """

    return send_via_brevo_api(
        to_email=MAIL_FROM,  
        subject=subject,
        html_content=body,
    )
