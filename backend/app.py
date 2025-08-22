from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Simple in-memory storage
documents = []
users = [
    {"username": "admin", "password": "admin123", "email": "admin@example.com"}
]

@app.route('/api/auth/login', methods=['POST'])
def login():
    """
    Handle user login.
    """
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400
    
    # Simple user validation (in production, use proper password hashing)
    user = next((u for u in users if u['username'] == username and u['password'] == password), None)
    
    if user:
        return jsonify({
            "token": f"fake_token_{username}_{len(users)}",
            "username": username
        }), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401

@app.route('/api/auth/register', methods=['POST'])
def register():
    """
    Handle user registration.
    """
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not username or not email or not password:
        return jsonify({"error": "Username, email and password are required"}), 400
    
    # Check if user already exists
    if any(u['username'] == username for u in users):
        return jsonify({"error": "Username already exists"}), 409
    
    if any(u['email'] == email for u in users):
        return jsonify({"error": "Email already exists"}), 409
    
    # Add new user
    new_user = {"username": username, "password": password, "email": email}
    users.append(new_user)
    
    return jsonify({
        "message": "User registered successfully",
        "user": {"username": username, "email": email}
    }), 201

@app.route('/api/documents', methods=['GET'])
def get_documents():
    """
    Handles fetching and searching documents.
    """
    search_query = request.args.get('search', '').lower()
    if search_query:
        filtered_docs = [
            doc for doc in documents
            if search_query in doc['numero_dossier'].lower() or
               search_query in doc['numero_carton'].lower() or
               search_query in doc['modele'].lower()
        ]
        return jsonify(filtered_docs)
    
    return jsonify(documents)

@app.route('/api/documents', methods=['POST'])
def add_document():
    """
    Handles adding a new document.
    """
    new_doc = request.get_json()
    new_doc['id'] = len(documents) + 1  # Assign a simple ID
    documents.append(new_doc)
    return jsonify({"message": "Document added successfully", "document": new_doc}), 201

@app.route('/api/documents/<int:doc_id>', methods=['DELETE'])
def delete_document(doc_id):
    """
    Handles deleting a document.
    """
    global documents
    documents = [doc for doc in documents if doc['id'] != doc_id]
    return jsonify({"message": "Document deleted successfully"}), 200

@app.route('/api/documents/<int:doc_id>', methods=['PUT'])
def update_document(doc_id):
    """
    Handles updating a document.
    """
    updated_doc = request.get_json()
    for i, doc in enumerate(documents):
        if doc['id'] == doc_id:
            updated_doc['id'] = doc_id
            documents[i] = updated_doc
            return jsonify({"message": "Document updated successfully", "document": updated_doc}), 200
    
    return jsonify({"error": "Document not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)