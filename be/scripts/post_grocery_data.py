# scripts/upsert_user_groceries.py

import psycopg2
from psycopg2 import sql

def upsert_user_groceries(user_id, items):
    # Database connection parameters
    conn_params = {
        "dbname": "postgres",
        "user": "postgres",
        "password": "00edward00",
        "host": "localhost",
        "port": "5432"
    }
    
    # Ensure user_id is a string
    user_id = str(user_id)

    # Upsert query for each item
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
        # Establish a database connection
        conn = psycopg2.connect(**conn_params)
        cursor = conn.cursor()
        
        # Upsert each item
        for item in items:
            cursor.execute(upsert_query, (
                user_id,
                item['item'],
                item['quantity'],
                item['category'],
                item['purchase_date'],
                item['expiry_date']
            ))
        
        # Commit the transaction
        conn.commit()
        
        # Close the cursor and connection
        cursor.close()
        conn.close()
        
        return str(user_id), 201
    except Exception as e:
        return {"error": f"An error occurred: {e}"}, 500

# # Example usage
# if __name__ == '__main__':
#     user_id = "1"
#     items = [
#         {
#             "item": "apple", 
#             "quantity": "42", 
#             "category": "fruit", 
#             "purchase_date": "2024-06-05", 
#             "expiry_date": "2024-06-12"
#         },
#         {
#             "item": "banana", 
#             "quantity": "30", 
#             "category": "fruit", 
#             "purchase_date": "2024-06-06", 
#             "expiry_date": "2024-06-15"
#         }
#     ]
#     result, status_code = upsert_user_groceries(user_id, items)
#     print(result, status_code)