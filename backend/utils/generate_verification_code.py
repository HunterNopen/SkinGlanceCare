import secrets

def generate_verification_code():
    return secrets.token_hex(3) 
