from ssl import create_default_context
from email.mime.text import MIMEText
from smtplib import SMTP
from backend.config import MAIL_HOST, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD
from backend.db.schemas import MailBody

#using smtp to send email
def send_verification_email(email: str, code: str):
    msg = MailBody(
        to=[email],
        subject="Verify your email",
        body=f"<p>Your code: <b>{code}</b></p>"
    )

    message = MIMEText(msg.body, "html")
    message["From"] = MAIL_USERNAME
    message["To"] = email
    message["Subject"] = msg.subject

    ctx = create_default_context()

    with SMTP(MAIL_HOST, MAIL_PORT) as server: 
        server.starttls()
        server.login(MAIL_USERNAME, MAIL_PASSWORD)
        server.send_message(message)

