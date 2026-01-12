from PIL import Image
from fastapi import HTTPException, UploadFile
import io


def validate_image(file: UploadFile):

    MAX_FILE_SIZE_MB = 10
    ALLOWED_FORMATS = {"JPEG", "PNG", "WEBP"}
    MAX_WIDTH = 4096
    MAX_HEIGHT = 4096
    MIN_WIDTH = 224
    MIN_HEIGHT = 224

    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)

    if file_size > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=400, detail=f"Image is too large (max {MAX_FILE_SIZE_MB} MB)"
        )

    try:
        image = Image.open(file.file)
        image.verify()
    except Exception:
        raise HTTPException(status_code=400, detail="Image is not valid")

    file.file.seek(0)
    image = Image.open(file.file)

    if image.format not in ALLOWED_FORMATS:
        raise HTTPException(status_code=400, detail=f"Incorrect format: {image.format}")

    width, height = image.size

    if width < MIN_WIDTH or height < MIN_HEIGHT:
        raise HTTPException(
            status_code=400, detail=f"Too small resolution ({width}x{height})"
        )

    if width > MAX_WIDTH or height > MAX_HEIGHT:
        raise HTTPException(
            status_code=400, detail=f"Too large resoluyion ({width}x{height})"
        )

    file.file.seek(0)
