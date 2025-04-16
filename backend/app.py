from flask import Flask
from flask_cors import CORS
from models.inventory import db
from routes.inventory_routes import inventory_bp
from urllib.parse import quote_plus
from dotenv import load_dotenv
load_dotenv()
import os

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'defaultsecret')

USER = os.getenv("user")
PASSWORD = quote_plus(os.getenv("password"))  # just in case
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")

DATABASE_URL = f"postgresql+psycopg2://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}?sslmode=require"
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL

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

if __name__ == "__main__":
    with app.app_context():
        if os.getenv("FLASK_ENV") == "development":
            db.create_all()  # only runs in development
    app.run()


