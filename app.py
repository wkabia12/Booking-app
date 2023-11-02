from flask import jsonify
from flask import render_template, jsonify, request
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:password@localhost:3306/scheduling_app'
SQLALCHEMY_TRACK_MODIFICATIONS = False
db = SQLAlchemy(app)


class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    services = db.relationship('Service', backref='category', lazy=True)


class Service(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    category_id = db.Column(db.Integer, db.ForeignKey(
        'category.id'), nullable=False)

# Home route to display the index.html template
@app.route('/services', methods=['GET'], strict_slashes=False)
def index():
    # Fetch categories and services from the database
    categories = Category.query.all()
    services = Service.query.all()

    return render_template('index.html', categories=categories, services=services)


# Endpoint to get services based on the selected category
@app.route('/services/<category_id>', methods=['GET'], strict_slashes=False)
def get_services(category_id):
    if category_id.lower() == 'all':
        # If 'All' category is selected, return all services
        services = Service.query.all()
    else:
        # Fetch services for the given category from the database
        services = Service.query.filter_by(category_id=category_id).all()

    # Convert services data to a list of dictionaries
    services_data = []
    for service in services:
        service_data = {
            'name': service.name,
            'description': service.description,
            # Include other service attributes as needed
        }
        services_data.append(service_data)

    # Return services data as a JSON response
    return jsonify(services_data)
