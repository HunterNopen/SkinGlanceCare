import aiosmtplib
from email.message import EmailMessage
import os


async def send_contact_email(sender_email: str, message: str):
    email = EmailMessage()
    email["From"] = sender_email
    email["To"] = os.getenv("CONTACT_RECEIVER")
    email["Subject"] = "Nowa wiadomość z formularza kontaktowego"
    email.set_content(
        f"""
Email nadawcy: {sender_email}

Wiadomość:
{message}
"""
    )

    await aiosmtplib.send(
        email,
        hostname=os.getenv("SMTP_HOST"),
        port=int(os.getenv("SMTP_PORT")),
        start_tls=True,
        username=os.getenv("SMTP_USER"),
        password=os.getenv("SMTP_PASSWORD"),
    )
