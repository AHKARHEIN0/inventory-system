from flask import Flask
from flask_cors import CORS
import os
from routes.inventory_routes import inventory_bp

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'defaultsecret')

# Register routes
app.register_blueprint(inventory_bp)

@app.route('/')
def home():
    return {"message": "Inventory backend is running"}

if __name__ == '__main__':
    app.run(debug=True)
