from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import requests
from PIL import Image
import base64
from io import BytesIO
import time

app = FastAPI()

# Load your API token
API_TOKEN = "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"

# Function to encode image to base64
def encode_image(image_bytes):
    return base64.b64encode(image_bytes).decode("utf-8")

# Define API endpoint
API_URL = "https://api-inference.huggingface.co/models/google/vit-base-patch16-224"

# Define headers
headers = {
    "Authorization": f"Bearer {API_TOKEN}"
}

# Define payload
def get_payload(image_base64):
    return {"inputs": image_base64}

# Function to make the request with retry logic
def get_prediction(image_base64):
    payload = get_payload(image_base64)
    for attempt in range(5):
        response = requests.post(API_URL, headers=headers, json=payload)
        result = response.json()
        if 'error' in result and 'loading' in result['error']:
            print(f"Attempt {attempt + 1}: Model is still loading. Waiting for 10 seconds.")
            time.sleep(10)  # Wait for 10 seconds before retrying
        else:
            return result
    return {"error": "Model did not load after several attempts"}
@app.get('/')
def read_root():
    return {"Success"}
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid image format. Only JPEG and PNG are supported.")
    
    image_bytes = await file.read()
    image_base64 = encode_image(image_bytes)
    result = get_prediction(image_base64)
    return JSONResponse(content=result)

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)
