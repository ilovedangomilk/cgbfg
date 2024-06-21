# scripts/receipt_scanner.py

import base64
import requests
import json
import os
from openai import OpenAI
from scripts.db_connection import upsert_user_groceries
from datetime import datetime, timedelta
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
load_dotenv("/be/scripts/.env")
api_key=os.environ.get("OPENAI_API_KEY")

model = SentenceTransformer('all-MiniLM-L6-v2')

def post_data(user_id, items):
    # Call the upsert function to insert data into the database
    result, status_code = upsert_user_groceries(user_id, items)
    
    if status_code != 201:
        print(f"Error posting data: {result['error']}")
    else:
        print(f"Data posted successfully for user {user_id}")

### Write receipt scanner code here and call post_data with the extracted data
def encode_image(image_path):
  script_dir = os.path.dirname(os.path.abspath(__file__))  # Get the absolute path of the current script
  image_abs_path = os.path.join(script_dir, '..', image_path)
  with open(image_abs_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')

### Extract food items from a given image
def extract_text(image_path):
    base64_image = encode_image(image_path)
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
        }

    payload = {
    "model": "gpt-4o",
    "messages": [
        {
        "role": "user",
        "content": [
            {
            "type": "text",
            "text": "Extract only the food items in the image and their corresponding quantity, and return it as a json object with the following format: '<food>':'<quantity>'"
            },
            {
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{base64_image}"
            }
            }
        ]
        }
    ],
    "max_tokens": 300
    }

    response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
    
    # Extract items from LLm response
    content = response.json()['choices'][0]['message']['content']
    json_content = content.split('```json\n')[1].split('\n```')[0]
    items = json.loads(json_content)
    output_items = []

    # For each item in the receipt, generate the following format {"item": "salmon", "quantity": "15", "category": "fish", "purchase_date": "2024-06-05", "expiry_date": "2024-06-12"}
    for item_name, quantity in items.items():
        category, purchase_date, expiry_date = determine_category(item_name)
        output_item = {
            "item": item_name.lower(),
            "quantity": quantity,
            "category": category,
            "purchase_date": purchase_date,
            "expiry_date": expiry_date
        }
        output_items.append(output_item)
    print(output_items)
    return output_items
    
    """
    output = {
        "user_id": "1",
        "items": output_items
    }
    output_json = json.dumps(output, indent=2)
    print(output_json)
    """
    
def determine_category(item_name):
    categories = {
        "Fruit":7,
        "Vegetable":7,
        "Meat":2,
        "Grain":365,
        "Seafood":2,
        "Dairy":7,
        "Condiment":365,    
        "Dried Good":365
    }
    category_embeddings = model.encode(list(categories.keys()))
    item_embedding = model.encode([item_name])
    similarities = cosine_similarity(item_embedding, category_embeddings)[0]
    max_similarity_index = similarities.argmax()
    category = list(categories.keys())[max_similarity_index]
    expiry_days = categories[category]

    # Set purchase date to today
    purchase_date = datetime.now().date().strftime("%Y-%m-%d")

    # Calculate expiry date
    expiry_date = (datetime.now().date() + timedelta(days=expiry_days)).strftime("%Y-%m-%d")

    return category, purchase_date, expiry_date

### Extracted data should be in the format of the items list below which is a list of dictionaries

# Example usage
if __name__ == '__main__':
    user_id = "4"  # Replace with the user_id you want to use
    items = [
        {"item": "salmon", "quantity": "15", "category": "fish", "purchase_date": "2024-06-05", "expiry_date": "2024-06-12"},
        {"item": "broccoli", "quantity": "5", "category": "vegetable", "purchase_date": "2024-06-05", "expiry_date": "2024-06-12"}
    ]
    post_data(user_id, items)
