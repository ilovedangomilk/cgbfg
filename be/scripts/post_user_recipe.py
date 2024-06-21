import json
import psycopg2
import os

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Function to upsert recipes into the database
def upsert_user_recipes(recipes):
    upsert_query = """
    INSERT INTO public.user_recipes (user_id, recipe_name, ingredients, instructions, difficulty, time_required, description)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT (user_id, recipe_name)
    DO UPDATE SET
        ingredients = EXCLUDED.ingredients,
        instructions = EXCLUDED.instructions,
        difficulty = EXCLUDED.difficulty,
        time_required = EXCLUDED.time_required,
        description = EXCLUDED.description;
    """

    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor()
        for recipe in recipes:
            cursor.execute(upsert_query, (
                recipe['user_id'],
                recipe['recipe_name'],
                str(recipe['ingredients']), 
                str(recipe['instructions']), 
                recipe['difficulty'],
                recipe['time_required'],
                recipe['description']
            ))
        conn.commit()
        cursor.close()
        conn.close()
        return "Upsert successful", 201
    except Exception as e:
        return {"error": f"An error occurred: {e}"}, 500

# Sample data to test the upsert function
# sample_data = [
#   {
#     "user_id": "10001",
#     "recipe_name": "Kung Pao Chicken",
#     "ingredients": [
#       ("Chicken", "300g"),
#       ("Celery", "150g"),
#       ("Soy Sauce", "30ml"),
#       ("Garlic", "2 cloves, minced"),
#       ("Ginger", "1 tsp, minced"),
#       ("Dried Red Chilies", "3 pieces"),
#       ("Green Onions", "2 stalks, chopped")
#     ],
#     "instructions": [
#       "Heat oil in a pan.",
#       "Fry the garlic, ginger, and chilies until fragrant.",
#       "Add chicken and stir-fry until browned.",
#       "Mix soy sauce, vinegar, and sugar with cornstarch and water to make a sauce.",
#       "Pour over chicken, add peanuts and vegetables, and cook until sauce thickens."
#     ],
#     "difficulty": "Medium",
#     "time_required": "45 minutes",
#     "description": "A spicy, flavorful dish that combines tender chicken with crunchy peanuts and a fiery sauce."
#   }
# ]

# # Call the upsert function with the sample data
# result, status_code = upsert_user_recipes(sample_data)
# print(result)
