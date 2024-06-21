# scripts/recipe_recommender.py
import os
from openai import OpenAI
from datetime import datetime, timedelta
from scripts.db_connection import get_grocery_data_by_user_id, get_user_recipes_by_user_id, upsert_user_recipes, upsert_user_groceries
from dotenv import load_dotenv
load_dotenv("/be/scripts/.env")
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def analyze_user_data(user_id):
    # Fetch data from the database
    data = get_grocery_data_by_user_id(user_id)
    
    # Create the dictionary with dates as keys and list of (item, quantity) tuples as values
    date_dict = {}
    for item in data:
        expiry_date = item['expiry_date']
        item_tuple = (item['item'], item['quantity'])
        if expiry_date not in date_dict:
            date_dict[expiry_date] = []
        date_dict[expiry_date].append(item_tuple)
    
    # Sort the dictionary by date keys
    sorted_date_dict = {k: date_dict[k] for k in sorted(date_dict)}
    return sorted_date_dict

def analyze_user_recipes(user_id):
    # Fetch user recipes from the database
    data = get_user_recipes_by_user_id(user_id)
    
    # Create a list of tuples with (recipe_name, description)
    recipes_list = [(recipe['recipe_name'], recipe['description']) for recipe in data]
    
    return recipes_list

# # variables for getting user_data (items) and user_recipes (FEEL FREE TO CHANGE THE VARIABLE NAMES TO YOUR LIKING)
# user_recipes = analyze_user_recipes
# user_data = analyze_user_data


# INSERT RECIPE RECOMMENDER CODE HERE 


def fetch_ingredients(user_id):
    # Assuming the function `analyze_data` returns a dictionary sorted by purchase dates.
    groceries = analyze_user_data(user_id)
    near_expiry_ingredients = []
    all_groceries = []

    # Check for items within 3 days of expiry
    cutoff_date = datetime.now() + timedelta(days=10) 
    for date_str, items in groceries.items():
        all_groceries.extend(items)
        if datetime.strptime(str(date_str), "%Y-%m-%d") <= cutoff_date:
            near_expiry_ingredients.append(items[0])
    processed_near_expiry_ingredients = []
    for ele in near_expiry_ingredients:
        processed_near_expiry_ingredients.append(ele[0])
    return all_groceries, processed_near_expiry_ingredients

def generate_recipe_suggestions(ingredients, exp_ingredients, user_recipes, cuisine, servings=1): # where ingredients is a string of comma-separated ingredients
    # Prepare the prompt for GPT based on near expiry ingredients and user's recipes
    all_ingredients_list = ', '.join([item[0] for item in ingredients])
    exp_ingredients_list = ', '.join([item[0] for item in exp_ingredients])
    recipes_list = ', '.join([recipe[0] for recipe in user_recipes])

    extra_prompt = ""
    if recipes_list != []:
        extra_prompt = f"Base your recipe on the cuisines from these recipes if possible: {recipes_list}"

    prompt = f"""
    Create a {cuisine} food recipe using the following ingredients close to expiry: {exp_ingredients_list}.

    The recipe should be for {servings} servings.

    Make sure the recipe follows the following preferences: {cuisine}.

    I have the following ingredients available: {all_ingredients_list}.

    IMPORTANT!!! YOU MUST NOT USE INGRIDIENTS THAT ARE NOT AVAILABLE!

    Make sure the unit of measurement for ingredients is in metric.

    You do not need to use all the ingredients.

    Give your output in the following format!

    Recipe Name: The name of the dish.
    Description: A short description of the dish.
    Ingredients: Each ingredient listed in a tuple format ('ingredient name', 'quantity'). IMPORTANT! all quantities need to be provided in the metric system! (e.g., - Chicken: 200g, - Olive Oil: 5ml).
    Detailed Steps: A list of steps involved in making the dish, each step described in string format and including specific details such as cooking time, temperature, and techniques.
    Time Required: Total time needed to prepare and cook the dish.
    Difficulty: Difficulty level of the recipe (e.g., Easy, Medium, Hard).
    
    Each step in the "Detailed Steps" should be a concise but comprehensive instruction, incorporating elements like exact cooking times, temperatures, and special techniques (e.g., 'Sauté onions over medium heat until translucent, about 5 minutes', 'Bake at 200°C for 30 minutes').
    
    \n{extra_prompt}
    
    """

    response = client.chat.completions.create(
        model='gpt-3.5-turbo-0125',
        messages=[
            {
            "role": "user",
            "content": prompt
            }
        ],
        temperature=2,
        max_tokens=700,
        top_p=0.2,
        frequency_penalty=0,
        presence_penalty=0
    )
    choices = response.choices[0]
    text = choices.message.content
    return text

def unit_convert(s):
    index = len(s) - 1
    while index >= 0 and not s[index].isdigit():
        index -= 1

    numeric_part = s[:index + 1]
    unit_part = s[index + 1:].strip().lower()

    conversions = {
        1000: {"kg", "kilogram", "l", "liter", "litre"},
        0.001: {"mg", "milligram"}
    }

    numeric_value = float(numeric_part) if '.' in numeric_part else int(numeric_part)

    for multiplier, units in conversions.items():
        if unit_part in units:
            converted_value = numeric_value * multiplier
            new_unit = "g" if "k" in unit_part or "m" in unit_part else "ml"
            return converted_value, new_unit

    return numeric_value, unit_part

def extract_recipe(recipe_data):
    lines = recipe_data.strip().split('\n')

    recipe_dict = {}

    in_ingredients = False
    in_steps = False
    ingredients = []
    steps = []

    for line in lines:
        line = line.strip()
        if line.startswith('Recipe Name:'):
            recipe_dict['recipe_name'] = line.split(': ')[1].strip()
        elif line.startswith('Ingredients:'):
            in_ingredients = True
            in_steps = False
        elif line.startswith('Detailed Steps:'):
            in_ingredients = False
            in_steps = True
        elif line.startswith('Time Required:'):
            recipe_dict['time_required'] = line.split(': ')[1].strip()
        elif line.startswith('Description:'):
            recipe_dict['description'] = line.split(': ')[1].strip()
        elif line.startswith('Difficulty:'):
            recipe_dict['difficulty'] = line.split(': ')[1].strip()
        elif in_ingredients and '-' in line:
            # Extract ingredient
            ingredient_data = line.split('-', 1)[1].strip()
            if ':' in ingredient_data:
                ingredient, quantity_raw = ingredient_data.split(':', 1)
                
                quantity_list = quantity_raw.strip().split(' ', 1)
                if len(quantity_list) == 1:
                    quantity, unit = unit_convert(quantity_list[0])
                    quantity = str(quantity) + unit
                    
                elif quantity_list[0].isnumeric():
                    if quantity_list[1].lower() in ['tsp', 't', 'tsp.', 't.', 'teaspoon']:
                        quantity = f"{round(float(quantity_list[0]) * 4.93)} ml"
                    elif quantity_list[1].lower() in ['tbsp', 'tbs', 'tbl', 'tbl.', 'tbsp.', 'tablespoon']:
                        quantity = f"{round(float(quantity_list[0]) * 14.79)} g"
                    elif quantity_list[1].lower() in ['fl oz', 'floz', 'fluid ounce', 'fluid oz']:
                        quantity = f"{round(float(quantity_list[0]) * 29.57)} ml"
                    elif quantity_list[1].lower() in ['cup', 'c', 'cups']:
                        quantity = f"{round(float(quantity_list[0]) * 236.59)} g"
                    elif quantity_list[1].lower() in ['pint', 'pt', 'pints']:
                        quantity = f"{round(float(quantity_list[0]) * 473.18)} ml"
                    elif quantity_list[1].lower() in ['quart', 'qt', 'quarts']:
                        quantity = f"{round(float(quantity_list[0]) * 946.35)} ml"
                    elif quantity_list[1].lower() in ['gallon', 'gal', 'gallons']:
                        quantity = f"{round(float(quantity_list[0]) * 3785.41)} ml"
                    elif quantity_list[1].lower() in ['oz', 'ounce', 'ounces']:
                        quantity = f"{round(float(quantity_list[0]) * 28.35)} g"
                    elif quantity_list[1].lower() in ['lb', 'lbs', 'pound', 'pounds']:
                        quantity = f"{round(float(quantity_list[0]) * 453.59)} g"


                else:   # if its 'to taste' or some other bs
                    quantity = '1'
                ingredients.append((ingredient.strip(), quantity.strip()))
            else:
                ingredients.append(ingredient_data)  # In case there's no quantity specified
        elif in_steps and line and line[0].isdigit():
            # Extract steps 
            steps.append(line.split('.', 1)[1].strip())
    
    recipe_dict['ingredients'] = str(ingredients)
    recipe_dict['instructions'] = str(steps)
    return recipe_dict

def jsonify_recipe(recipe_data, user_id):
    # Assuming recipe_data is a dictionary with correct keys
    return {
        "user_id": str(user_id),
        "recipe_name": recipe_data['recipe_name'],
        "ingredients": recipe_data['ingredients'],
        "instructions": recipe_data['instructions'],
        "difficulty": recipe_data['difficulty'],
        "time_required": recipe_data['time_required'],
        "description": recipe_data.get('description', '')
    }

def remove_used_ingredients(user_id, ingredients):
    data = get_grocery_data_by_user_id(user_id)
    for ingredient in ingredients:
        for item in data:
            item_name = item['item']
            if item_name.lower() == ingredient(0).lower():
                item_quantity = item['quantity']
                if item_quantity.isnumeric():
                    item['quantity'] = str(float(item_quantity) - float(ingredient(1)))
                else:
                    quantity, unit = unit_convert(item_quantity)
                    item['quantity'] = str(float(item_quantity) - quantity) + unit

                upsert_user_groceries(user_id, item)

def recommend_recipes(user_id, cuisine, servings):
    all_ingredients, near_expiry_ingredients = fetch_ingredients(user_id)
    user_recipes = analyze_user_recipes(user_id)
    if near_expiry_ingredients:
        raw_recipe = generate_recipe_suggestions(all_ingredients, near_expiry_ingredients, user_recipes, cuisine, servings)
        recipe_dict = extract_recipe(raw_recipe)
        recipe_json = jsonify_recipe(recipe_dict, user_id) 
        print(recipe_json)
        return recipe_json
    else:
        return "No ingredients are close to expiry."

def store_recipe(user_id, recipe_dict):
    recipe_json = jsonify_recipe(recipe_dict, user_id)  # Make sure this returns the correct structure
    response = upsert_user_recipes([recipe_json])  # Ensure this is a list of dictionaries
    return response

# near_expiry_ingredients = "Fish, Potato, Carrot, Onion, Garlic, Ginger, Soy Sauce, Oyster Sauce, Cornstarch, Sugar, Salt, Pepper, Oil"
# user_recipes = []
# print(recommend_recipes(123456, "Chinese"))


## HELPER FUNCTIONS

def split_quantity(quantity):
    index = len(quantity) - 1
    while index >= 0 and not quantity[index].isdigit():
        index -= 1

    numeric_part = quantity[:index + 1].strip()
    unit_part = quantity[index + 1:].strip().lower()

    numeric_value = float(numeric_part) if '.' in numeric_part else int(numeric_part)
    return numeric_value, unit_part

def subtract_quantity(old_quantity, new_quantity):
    old_numeric, old_unit = split_quantity(old_quantity)
    new_numeric, new_unit = split_quantity(new_quantity)

    # if old_unit != new_unit:
    #     raise ValueError(f"Units do not match.\n{old_unit} vs {new_unit}")

    updated_numeric = old_numeric - new_numeric
    updated_quantity = f"{updated_numeric} {old_unit}".strip()

    return updated_quantity