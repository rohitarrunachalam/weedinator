import random
from supabase import create_client

# Set up your Supabase credentials
supabase_url = ""
supabase_key = ""
table_name = "location"  # Replace with your actual table name

supabase = create_client(supabase_url, supabase_key)

# Function to generate random coordinates within Tamil Nadu boundaries
def generate_random_coordinates():
    # Tamil Nadu boundaries
    min_lat, max_lat = 8.047784, 13.496666
    min_lon, max_lon = 76.230728, 80.324482

    lat = round(random.uniform(min_lat, max_lat), 6)
    lon = round(random.uniform(min_lon, max_lon), 6)
    return lat, lon

# Function to insert data into the Supabase table
def insert_data_into_supabase(weed_id, lat, lon):
    data = {
        "weedID": int(weed_id),  # Convert the weedID to an integer
        "lat": lat,
        "lon": lon
    }

    response = supabase.table(table_name).insert([data]).execute()
    
    # if response.status_code == 201:
    #     print("Data inserted successfully!")
    # else:
    #     print("Error inserting data.")
    #     print("Response content")

# Generate and insert random coordinates with weedID
num_data_points = 10  # You can change this to the desired number of data points

for i in range(1, num_data_points + 1):
    weed_id = i  # Use an integer for weedID
    lat, lon = generate_random_coordinates()
    insert_data_into_supabase(weed_id, lat, lon)