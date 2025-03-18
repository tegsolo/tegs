from flask import Flask, request, jsonify
import pymongo

app = Flask(__name__)

# MongoDB Configuration
MONGO_URI = "mongodb://localhost:27017/"  # Replace with your MongoDB connection string
DB_NAME = "your_database_name"  # Replace with your database name
COLLECTION_NAME = "users" # Replace with your collection name

@app.route('/register', methods=['POST'])
def register():
    try:
        # Connect to MongoDB
        client = pymongo.MongoClient(MONGO_URI)
        db = client[DB_NAME]
        collection = db[COLLECTION_NAME]

        # Get registration data from the request
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        # Basic validation (you should add more robust validation)
        if not username or not email or not password:
            return jsonify({"error": "All fields are required"}), 400

        if existing_user := collection.find_one(
            {"username": username}
        ) or collection.find_one({"email": email}):
            return jsonify({"error": "Username or email already exists"}), 400


        # Insert the new user into the database
        user_data = {
            "username": username,
            "email": email,
            "password": password # In a real application, hash the password before storing
        }
        result = collection.insert_one(user_data)

        client.close() # Close the connection after usage

        return jsonify({"message": "User registered successfully", "user_id": str(result.inserted_id)}), 201

    except pymongo.errors.PyMongoError as e:
        return jsonify({"error": "Database error"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route('/admin/users', methods=['GET'])
def get_registered_users():
    try:
        client = pymongo.MongoClient(MONGO_URI)
        db = client[DB_NAME]
        collection = db[COLLECTION_NAME]

        users = list(collection.find({}, {'_id': 0, 'username': 1, 'email': 1}))  # Retrieve username and email, exclude _id
        client.close()
        return jsonify(users), 200

    except pymongo.errors.PyMongoError as e:
        return jsonify({"error": "Database error"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route('/admin/likes', methods=['GET'])
def get_likes():
    return jsonify({"likes": likes}), 200



if __name__ == '__main__':
    app.run(debug=True)
