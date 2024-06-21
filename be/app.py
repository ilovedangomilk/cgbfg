import os
import requests

def download_certificate():
    cert_dir = os.path.expanduser("~/.postgresql")
    os.makedirs(cert_dir, exist_ok=True)
    cert_path = os.path.join(cert_dir, "root.crt")
    
    if not os.path.exists(cert_path):
        url = "https://cockroachlabs.cloud/clusters/e3885e05-0fa9-450e-b512-2523fa52fcb6/cert"
        response = requests.get(url)
        
        with open(cert_path, 'wb') as cert_file:
            cert_file.write(response.content)
        print("Certificate downloaded successfully")
    else:
        print("Certificate already exists")

download_certificate()

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from scripts.db_connection import get_user_recipes_by_user_id, upsert_user_groceries, get_grocery_data_by_user_id, upsert_user_recipes, delete_user_grocery, delete_user_recipe
from scripts.db_connection import used_user_groceries
from scripts.db_connection import thrown_user_groceries
from scripts.recipe_recommender import recommend_recipes, store_recipe, subtract_quantity
from scripts.receipt_scanner import extract_text, post_data
from scripts.db_connection import get_most_wasted
from scripts.db_connection import get_most_used
from scripts.db_connection import get_used_info
from scripts.db_connection import get_thrown_info
import base64
from werkzeug.utils import secure_filename
import os
import warnings
import logging
import json

logging.basicConfig(level=logging.DEBUG)

# Suppress the specific FutureWarning related to resume_download
warnings.filterwarnings("ignore", category=FutureWarning, message="`resume_download` is deprecated and will be removed in version 1.0.0.")

try:
    # Your imports and code here
    from huggingface_hub import hf_hub_download

    # Example function call that might trigger the warning
    file_path = hf_hub_download(repo_id="your_repo_id", filename="your_filename", force_download=False)

    # Add more of your code here
    print("File downloaded to:", file_path)

except Exception as e:
    print("An error occurred:", e)


app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# cors = CORS(app, resources={r"/api/*": {"origins": frontend_url}})
# cors = CORS(app, resources={r"/*": {"origins": "*", "allow_headers": ["Content-Type", "Token"]}})
CORS(app)


# Ensure the upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


@app.route('/add_grocery', methods=['POST']) # POST request to add grocery items (can add multiple at the same time)
def add_grocery():
    data = request.get_json()  # This should be a list of dictionaries
    
    # Check if data is a list and not empty
    if not data or not isinstance(data, list):
        return jsonify({"error": "Invalid data format; expected a non-empty list of items."}), 400

    # Example of extracting user_id and items assuming all items belong to the same user
    # and user_id is consistent across all items.
    user_id = data[0].get('user_id')
    if not user_id:
        return jsonify({"error": "user_id is required for each item."}), 400
    
    items = []
    for item in data:
        if 'item' in item and 'quantity' in item and 'category' in item and 'purchase_date' in item and 'expiry_date' in item:
            items.append(item)
        else:
            return jsonify({"error": "Each item must include item, quantity, category, purchase_date, and expiry_date."}), 400

    # Now upsert the user's groceries
    result, status_code = upsert_user_groceries(user_id, items)
    
    if status_code != 201:
        return jsonify(result), status_code
    
    return jsonify({"message": "Data posted successfully", "user_id": result}), 201

@app.route('/used_grocery', methods=['POST']) # POST request to add grocery items (can add multiple at the same time)
def used_grocery():
    data = request.get_json()  # This should be a list of dictionaries
    
    # Check if data is a list and not empty
    if not data or not isinstance(data, list):
        return jsonify({"error": "Invalid data format; expected a non-empty list of items."}), 400

    # Example of extracting user_id and items assuming all items belong to the same user
    # and user_id is consistent across all items.
    user_id = data[0].get('user_id')
    if not user_id:
        return jsonify({"error": "user_id is required for each item."}), 400
    
    items = []
    for item in data:
        if 'item' in item and 'quantity' in item and 'category' in item and 'purchase_date' in item and 'expiry_date' in item:
            items.append(item)
        else:
            return jsonify({"error": "Each item must include item, quantity, category, purchase_date, and expiry_date."}), 400

    # Now upsert the user's groceries
    result, status_code = used_user_groceries(user_id, items)
    
    if status_code != 201:
        return jsonify(result), status_code
    
    return jsonify({"message": "Data posted successfully", "user_id": result}), 201

@app.route('/thrown_grocery', methods=['POST']) # POST request to add grocery items (can add multiple at the same time)
def thrown_grocery():
    data = request.get_json()  # This should be a list of dictionaries
    
    # Check if data is a list and not empty
    if not data or not isinstance(data, list):
        return jsonify({"error": "Invalid data format; expected a non-empty list of items."}), 400

    # Example of extracting user_id and items assuming all items belong to the same user
    # and user_id is consistent across all items.
    user_id = data[0].get('user_id')
    if not user_id:
        return jsonify({"error": "user_id is required for each item."}), 400
    
    items = []
    for item in data:
        if 'item' in item and 'quantity' in item and 'category' in item and 'purchase_date' in item and 'expiry_date' in item:
            items.append(item)
        else:
            return jsonify({"error": "Each item must include item, quantity, category, purchase_date, and expiry_date."}), 400

    # Now upsert the user's groceries
    result, status_code = thrown_user_groceries(user_id, items)
    
    if status_code != 201:
        return jsonify(result), status_code
    
    return jsonify({"message": "Data posted successfully", "user_id": result}), 201

@app.route('/grocery/<user_id>', methods=['GET'])
def get_grocery(user_id):
    return jsonify(get_grocery_data_by_user_id(user_id))

@app.route('/recipe/<user_id>', methods=['GET'])
def get_recipe(user_id):
    return jsonify(get_user_recipes_by_user_id(user_id))

@app.route('/delete_grocery', methods=['DELETE']) # DELETE request to delete grocery items, but can only delete one at a time
def delete_grocery():
    data = request.get_json()
    user_id = data.get('user_id')
    item = data.get('item')
    expiry_date = data.get('expiry_date')
    purchase_date = data.get('purchase_date')
    
    if not user_id or not item or not expiry_date or not purchase_date:
        return jsonify({"error": "user_id, item, expiry_date, and purchase_date are required"}), 400
    
    result, status_code = delete_user_grocery(user_id, item, expiry_date, purchase_date)
    
    if status_code != 200:
        return jsonify(result), status_code
    
    return jsonify({"message": "Item deleted successfully"}), 200

@app.route('/delete_recipe', methods=['DELETE'])
def delete_recipe():
    data = request.get_json()
    user_id = data.get('user_id')
    recipe_name = data.get('recipe_name')
    
    if not user_id or not recipe_name:
        return jsonify({"error": "user_id and recipe_name are required"}), 400
    
    result, status_code = delete_user_recipe(str(user_id), recipe_name)
    
    if status_code != 200:
        return jsonify(result), status_code
    
    return jsonify({"message": "Recipe deleted successfully"}), 200

@app.route('/recommend_recipe/<user_id>', methods=['GET'])
@cross_origin(origins="*", allow_headers=["Content-Type", "Authorization", "X-Requested-With"], supports_credentials=True)
def recommend_recipe(user_id):
    cuisine = request.args.get('cuisine', 'Singaporean')
    servings = request.args.get('servings', '1')
    try:
        recipe = [recommend_recipes(user_id, cuisine, servings)]
        recipe = jsonify(recipe)
        return recipe
    
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


@app.route('/add_recipe', methods=['POST'])
def store_recipe():
    data = request.get_json()
    
    # Basic validation to ensure data is in the expected format
    if not data or not isinstance(data, list):  # Data should be a list of recipes
        return jsonify({"error": "Invalid data format; expected a non-empty list of recipes."}), 400

    # Validate each recipe's structure
    required_keys = ['user_id', 'recipe_name', 'ingredients', 'instructions', 'difficulty', 'time_required', 'description']
    responses = []
    
    for recipe in data:
        if not all(key in recipe for key in required_keys):
            return jsonify({"error": "Missing required recipe information."}), 400
        
        if not isinstance(recipe['ingredients'], list) or not isinstance(recipe['instructions'], list):
            return jsonify({"error": "Ingredients and instructions must be in list format."}), 400

        # Convert ingredients from list of lists to list of tuples
        try:
            recipe['ingredients'] = [tuple(ingredient) for ingredient in recipe['ingredients']]
            
        except ValueError:
            return jsonify({"error": "Each ingredient must be a list with two elements (name and quantity)."}), 400
        # Extract the user ID and pass the entire recipe dictionary
        response, status_code = upsert_user_recipes(recipe)
        responses.append((response, status_code))
    
    # Check all responses for errors
    for response, status in responses:
        if status != 201:
            return jsonify({"error": response}), status
    
    return jsonify([{"message": "Data posted successfully", "response": resp} for resp, stat in responses]), 201


@app.route('/update_inventory', methods=['POST'])
def update_inventory_item():
    data = request.get_json()
    
    # Check if data is a list and not empty
    if not data or not isinstance(data, list):
        return jsonify({"error": "Invalid data format; expected a non-empty list of items."}), 400
    user_id = data[0].get('user_id')
    if not user_id:
        return jsonify({"error": "user_id is required for each item."}), 400
    
    items = []
    for item in data:
        if 'item' in item and 'quantity' in item and 'category' in item and 'purchase_date' in item and 'expiry_date' in item:
            items.append(item)
        else:
            return jsonify({"error": "Each item must include item, quantity, category, purchase_date, and expiry_date."}), 400

    # Fetch the existing inventory items for the user
    old_data = get_grocery_data_by_user_id(user_id)

    # Create a dictionary to hold the updated inventory
    updated_inventory = {item['item']: item for item in old_data}

    # Iterate through the new data and update the quantities
    for item in items:
        item_name = item['item']
        new_quantity = item['quantity']

        if item_name in updated_inventory:
            old_quantity = updated_inventory[item_name]['quantity']
            updated_quantity = subtract_quantity(old_quantity, new_quantity)
            updated_inventory[item_name]['quantity'] = updated_quantity

    # Convert the updated inventory back to a list
    updated_inventory_list = list(updated_inventory.values())

    # Now upsert the user's groceries
    result, status_code = upsert_user_groceries(user_id, updated_inventory_list)
    
    if status_code != 201:
        return jsonify(result), status_code

    return jsonify({"message": "Inventory updated successfully."}), 201

@app.route('/upload_receipt/<user_id>', methods=['POST'])
def upload_receipt(user_id):
    data = request.get_json()
    image_data = data['image']
    
    # Decode the image from base64
    image_data = base64.b64decode(image_data.split(',')[1])

    # Save the image to a temporary file
    with open("temp_image.png", "wb") as f:
        f.write(image_data)
    
    extracted_items = extract_text("temp_image.png")

    # post_data(user_id, extracted_items)

    return jsonify({'extracted_text': extracted_items, 'user_id': user_id})


@app.route('/upload_items/<user_id>', methods=['POST'])
def save_receipt_items(user_id):
    extracted_items = request.json['items']
    print(extracted_items)
    post_data(user_id, extracted_items)
    return jsonify({'extracted_text': extracted_items, 'user_id': user_id})


@app.route('/upload_receipt_two/<user_id>', methods=['POST'])
def upload_file(user_id):
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        extracted_items = extract_text(filepath)
        post_data(user_id, extracted_items)
        return jsonify({'extracted_text': extracted_items, 'user_id': user_id})

@app.route('/get_most_wasted/<user_id>', methods=['GET'])
def get_most_wasted_items(user_id):
    return jsonify(get_most_wasted(user_id))

@app.route('/get_most_used/<user_id>', methods=['GET'])
def get_most_used_items(user_id):
    return jsonify(get_most_used(user_id))

@app.route('/get_used_info/<user_id>', methods=['GET']) 
def get_used_info_items(user_id):
    return jsonify(get_used_info(user_id))

@app.route('/get_thrown_info/<user_id>', methods=['GET']) 
def get_thrown_info_items(user_id):
    return jsonify(get_thrown_info(user_id))




if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port='8000') # insert ur ip address here


######################### DONT CHANGE THIS, FOR EDWARD TO USE
# if __name__ == '__main__':
#     app.run(host="172.20.10.5", debug=True)

# # DONT DELETE THIS, FOR ANYBODY TO USE
# if __name__ == '__main__':
#     app.run(debug=True)

