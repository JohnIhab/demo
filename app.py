import requests
from PIL import Image
import base64
from io import BytesIO

# Load your API token
API_TOKEN = "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"

# Function to encode image to base64
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

# Load image
image_path = '/content/61bZ2w5w7AL.__AC_SX300_SY300_QL70_ML2_.jpg'
image_base64 = encode_image(image_path)

# Define API endpoint
API_URL = "https://api-inference.huggingface.co/models/google/vit-base-patch16-224"

# Define headers
headers = {
    "Authorization": f"Bearer {API_TOKEN}"
}

# Define payload
payload = {
    "inputs": image_base64
}

# Make the request
response = requests.post(API_URL, headers=headers, json=payload)
result = response.json()

# Print the result
print(result)
