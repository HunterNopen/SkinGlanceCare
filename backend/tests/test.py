import requests

GRADIO_URL = "http://localhost:7860"  
API_NAME = "/predict_openvino"  

file_path = "test.jpg"  

with open(file_path, "rb") as f:
    files = {"image": f}
    try:
        response = requests.post(GRADIO_URL + API_NAME, files=files, timeout=30)
        print("Status code:", response.status_code)
        print("Response:", response.text)
    except Exception as e:
        print("Błąd:", e)
