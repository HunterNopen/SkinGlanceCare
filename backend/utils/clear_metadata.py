from PIL import Image
from fastapi import HTTPException, UploadFile
from io import BytesIO

def clear_metadata(file: UploadFile) -> None:
    file.file.seek(0)

    with Image.open(file.file) as img:
        data = list(img.getdata())
        clean = Image.new(img.mode, img.size)
        clean.putdata(data)

        buffer = BytesIO()
        clean.save(buffer, format=img.format)
        buffer.seek(0)

    file.file.close()
    file.file = buffer
