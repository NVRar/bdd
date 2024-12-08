from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from pymongo import MongoClient

db = SQLAlchemy()
mongo_client = None

def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///alumnos.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)

    global mongo_client
    mongo_client = MongoClient("mongodb://localhost:27017/")
    app.mongo_db = mongo_client["alumnos_no_sql"]

    from .routes import main
    app.register_blueprint(main)
    
    with app.app_context():
        db.create_all()

    return app
