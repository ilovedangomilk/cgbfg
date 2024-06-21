# get_user_recipes.py

import psycopg2
from psycopg2.extras import RealDictCursor

def get_user_recipes_by_user_id(user_id):
    conn_params = {
    "dbname": "postgres",
    "user": "postgres",
    "password": "00edward00",
    "host": "localhost",
    "port": "5432"
        }
    
    user_id = str(user_id)
    select_query = """
    SELECT user_id, recipe_name, ingredients, instructions, difficulty, time_required, description
    FROM public.user_recipes
    WHERE user_id = %s;
    """

    try:
        conn = psycopg2.connect(**conn_params)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(select_query, (user_id,))
        recipes = cursor.fetchall()
        cursor.close()
        conn.close()
        return recipes
    except Exception as e:
        return {"error": f"An error occurred: {e}"}, 500