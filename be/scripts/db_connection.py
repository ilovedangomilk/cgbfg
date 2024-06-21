import os
import psycopg2
from psycopg2 import sql
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
import json

# Load environment variables from .env file
load_dotenv()

"""
run the following CLI command:
mkdir -p $env:appdata\postgresql\; Invoke-WebRequest -Uri https://cockroachlabs.cloud/clusters/e3885e05-0fa9-450e-b512-2523fa52fcb6/cert -OutFile $env:appdata\postgresql\root.crt
"""

def get_user_recipes_by_user_id(user_id):
    
    user_id = str(user_id)
    select_query = """
    SELECT user_id, recipe_name, ingredients, instructions, difficulty, time_required, description
    FROM public.user_recipes
    WHERE user_id = %s;
    """

    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(select_query, (user_id,))
        recipes = cursor.fetchall()
        cursor.close()
        conn.close()
        return recipes
    except Exception as e:
        return {"error": f"An error occurred: {e}"}, 500

def get_grocery_data_by_user_id(user_id):
    user_id = str(user_id)
    select_query = """
    SELECT user_id, item, quantity, category, purchase_date, expiry_date
    FROM public.groceries
    WHERE user_id = %s;
    """

    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(select_query, (user_id,))
        groceries = cursor.fetchall()
        cursor.close()
        conn.close()
        return groceries
    except Exception as e:
        return {"error": f"An error occurred: {e}"}, 500

def upsert_user_recipes(recipe):
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
        cursor.execute(upsert_query, (
            str(recipe['user_id']),
            str(recipe['recipe_name']),
            str(recipe['ingredients']), 
            str(recipe['instructions']), 
            str(recipe['difficulty']),
            str(recipe['time_required']),
            str(recipe['description'])
        ))
        conn.commit()
        cursor.close()
        conn.close()
        return "Upsert successful", 201
    except Exception as e:
        return {"error": f"An error occurred: {e}"}, 500

def upsert_user_groceries(user_id, items):
    user_id = str(user_id)
    upsert_query = """
    INSERT INTO public.groceries (user_id, item, quantity, category, purchase_date, expiry_date)
    VALUES (%s, %s, %s, %s, %s, %s)
    ON CONFLICT (user_id, item, purchase_date)
    DO UPDATE SET
        quantity = EXCLUDED.quantity,
        category = EXCLUDED.category,
        expiry_date = EXCLUDED.expiry_date;
    """

    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor()
        for item in items:
            cursor.execute(upsert_query, (
                user_id,
                item['item'],
                item['quantity'],
                item['category'],
                item['purchase_date'],
                item['expiry_date']
            ))
        conn.commit()
        cursor.close()
        conn.close()
        return str(user_id), 201
    except Exception as e:
        return {"error": f"An error occurred: {e}"}, 500

def used_user_groceries(user_id, items):
    user_id = str(user_id)
    upsert_query = """
    INSERT INTO public.used (user_id, item, quantity, category, purchase_date, expiry_date)
    VALUES (%s, %s, %s, %s, %s, %s)
    ON CONFLICT (user_id, item, purchase_date)
    DO UPDATE SET
        quantity = EXCLUDED.quantity,
        category = EXCLUDED.category,
        expiry_date = EXCLUDED.expiry_date;
    """

    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor()
        for item in items:
            cursor.execute(upsert_query, (
                user_id,
                item['item'],
                item['quantity'],
                item['category'],
                item['purchase_date'],
                item['expiry_date']
            ))
        conn.commit()
        cursor.close()
        conn.close()
        return str(user_id), 201
    except Exception as e:
        return {"error": f"An error occurred: {e}"}, 500


def thrown_user_groceries(user_id, items):
    user_id = str(user_id)
    upsert_query = """
    INSERT INTO public.thrown (user_id, item, quantity, category, purchase_date, expiry_date)
    VALUES (%s, %s, %s, %s, %s, %s)
    ON CONFLICT (user_id, item, purchase_date)
    DO UPDATE SET
        quantity = EXCLUDED.quantity,
        category = EXCLUDED.category,
        expiry_date = EXCLUDED.expiry_date;
    """

    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor()
        for item in items:
            cursor.execute(upsert_query, (
                user_id,
                item['item'],
                item['quantity'],
                item['category'],
                item['purchase_date'],
                item['expiry_date']
            ))
        conn.commit()
        cursor.close()
        conn.close()
        return str(user_id), 201
    except Exception as e:
        return {"error": f"An error occurred: {e}"}, 500

def delete_user_grocery(user_id, item, expiry_date, purchase_date):
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor()
        cursor.execute(
            sql.SQL("DELETE FROM public.groceries WHERE user_id = %s AND item = %s AND expiry_date = %s AND purchase_date = %s"),
            [user_id, item, expiry_date, purchase_date]
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Item deleted successfully"}, 200
    except Exception as e:
        return {"error": str(e)}, 500

def delete_user_recipe(user_id, recipe_name):
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor()
        cursor.execute(
            sql.SQL("DELETE FROM public.user_recipes WHERE user_id = %s AND recipe_name = %s"),
            [user_id, recipe_name]
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Recipe deleted successfully"}, 200
    except Exception as e:
        return {"error": str(e)}, 500
    
def update_inventory(user_id, item, change_in_quantity):
    user_id = str(user_id)
    update_query = """
    DO $$
    DECLARE 
        old_quantity_text VARCHAR;
        old_quantity INT;
        unit VARCHAR DEFAULT '';
    BEGIN
        -- Select the current quantity as text
        SELECT quantity INTO old_quantity_text FROM public.groceries 
        WHERE user_id = %s AND item = %s FOR UPDATE;

        -- Extract numeric part and unit if present
        old_quantity := CAST(SPLIT_PART(old_quantity_text, ' ', 1) AS INTEGER);
        IF POSITION(' ' IN old_quantity_text) > 0 THEN
            unit := SUBSTRING(old_quantity_text FROM POSITION(' ' IN old_quantity_text));
        END IF;

        -- Calculate new quantity and check if it goes negative
        IF old_quantity - %s < 0 THEN
            RAISE EXCEPTION 'Quantity cannot go below zero';
        ELSE
            -- Update the quantity with new value and existing unit
            UPDATE public.groceries
            SET quantity = CONCAT(old_quantity - %s, unit)
            WHERE user_id = %s AND item = %s;
        END IF;
    END $$;
    """

    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor()
        
        # Execute the update statement
        cursor.execute(update_query, (
            user_id,  # User ID for SELECT
            item,     # Item name for SELECT
            change_in_quantity,  # Quantity change for IF condition
            change_in_quantity,  # Quantity change for CONCAT
            user_id,  # User ID for UPDATE
            item      # Item name for UPDATE
        ))

        # Check if the update was successful
        if cursor.rowcount == 0:
            # No rows updated, possibly because the quantity would go negative
            conn.close()
            return {"error": "Failed to update: Quantity cannot go below zero."}, 400
        
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Inventory updated successfully"}, 200
    except Exception as e:
        return {"error": f"An error occurred: {e}"}, 500
    

def get_most_wasted(user_id):
    user_id = str(user_id)
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor()
        cursor.execute('''
        SELECT item, category, COUNT(*) AS appearance_count
        FROM public.thrown
        WHERE user_id = %s
        GROUP BY item, category
        ORDER BY appearance_count DESC
        LIMIT 3
    ''', (user_id,))
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return result
    except Exception as e:
        return {"error": str(e)}, 500

def get_most_used(user_id):
    user_id = str(user_id)
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor()
        cursor.execute('''
        SELECT item, category, COUNT(*) AS appearance_count
        FROM public.used
        WHERE user_id = %s
        GROUP BY item, category
        ORDER BY appearance_count DESC
        LIMIT 3
    ''', (user_id,))
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return result
    except Exception as e:
        return {"error": str(e)}, 500

def get_used_info(user_id):
    user_id = str(user_id)
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor()
        cursor.execute('''
        SELECT COUNT(*)
        FROM public.used
        WHERE user_id = %s
        ''', (user_id,))
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return result
    except Exception as e:
        return {"error": str(e)}, 500

def get_thrown_info(user_id):
    user_id = str(user_id)
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor()
        cursor.execute('''
        SELECT COUNT(*)
        FROM public.thrown
        WHERE user_id = %s
        ''', (user_id,))
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return result
    except Exception as e:
        return {"error": str(e)}, 500