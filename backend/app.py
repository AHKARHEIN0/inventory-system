from flask import Flask
from flask_cors import CORS
from models.inventory import db
from routes.inventory_routes import inventory_bp
import os

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'defaultsecret')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///inventory.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Setup DB and routes
db.init_app(app)
app.register_blueprint(inventory_bp)

@app.route('/')
def home():
    return {"message": "Inventory backend is running"}

# Create DB if not exists
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
