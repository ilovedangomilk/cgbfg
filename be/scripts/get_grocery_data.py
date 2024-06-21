# get_grocery_data.py
import psycopg2
from psycopg2.extras import RealDictCursor

def get_grocery_data_by_user_id(user_id):
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

    # Query to retrieve grocery data
    select_query = """
    SELECT user_id, item, quantity, category, purchase_date, expiry_date
    FROM public.groceries
    WHERE user_id = %s;
    """

    try:
        # Establish a database connection
        conn = psycopg2.connect(**conn_params)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Execute the query
        cursor.execute(select_query, (user_id,))
        
        # Fetch all results
        groceries = cursor.fetchall()
        
        # Close the cursor and connection
        cursor.close()
        conn.close()
        
        return groceries
    except Exception as e:
        return {"error": f"An error occurred: {e}"}, 500

# # Example usage
# user_id = "1"
# result, status_code = get_grocery_data_by_user_id(user_id)
# print(result)
