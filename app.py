from flask import flash, redirect, request, url_for, session
from flask import render_template, jsonify
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:password@localhost:3306/scheduling_app'
app.config['SECRET_KEY'] = '3b96c64401d7'
SQLALCHEMY_TRACK_MODIFICATIONS = False
db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)


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


def get_service_id(service_name):
    with db.engine.connect() as connection:
        query = text("SELECT id FROM service WHERE name = :service_name")
        result = connection.execute(query, {'service_name': service_name})
        service_id = result.scalar()
    return service_id


class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey(
        'service.id'), nullable=False)
    booking_date = db.Column(db.Date, nullable=False)
    # Store time as a string (e.g., "09:00 AM")
    start_time = db.Column(db.String(250), nullable=False)
    # Store time as a string (e.g., "10:00 AM")
    end_time =  db.Column(db.String(250), nullable=False)

    # Define relationships with User and Service tables
    user = db.relationship('User', backref='bookings')
    service = db.relationship('Service', backref='bookings')

    def __init__(self, user_id, service_id, booking_date, start_time, end_time):
        self.user_id = user_id
        self.service_id = service_id
        self.booking_date = booking_date
        self.start_time = start_time
        self.end_time = end_time


# Home route to display all categories and services
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

    # Return services data as a JSON response for ajax interpretation
    return jsonify(services_data)

# endpoint to dynamically generate service name on the booking card
@app.route('/booking/<service_name>', methods=['GET'])
def booking_form(service_name):

    return render_template('booking.html', service_name=service_name)


@app.route('/confirm_booking', methods=['POST'])
def confirm_booking():
    # Extract data from the JSON object
    data = request.get_json()
    print(request.get_json()) # debugging received data

    service_name = data.get('service_name')
    service_id = get_service_id(service_name)

    user_id = 2
    booking_date = data.get('booking_date')
    start_time = data.get('start_time')
    end_time = data.get('end_time')

    # Create a new booking entry in the database with start and end time slots
    new_booking = Booking(user_id=user_id, service_id=service_id,
                          booking_date=booking_date, start_time=start_time, end_time=end_time)
    db.session.add(new_booking)
    db.session.commit()

    return jsonify(message='Booking confirmed successfully')


@app.route('/history_data')
def history_data():
    user_id = 2  # Replace this with the actual user ID (e.g., obtained from session)

    # Query the Booking table to get bookings for the user
    user_bookings = Booking.query.filter_by(user_id=user_id).all()

    # Prepare the data to be sent as JSON
    booked_services = []
    for booking in user_bookings:
        service_id = booking.service_id
        # Query the Service table to get the service details based on the service_id
        service = Service.query.get(service_id)
        if service:
            service_info = {
                "service_name": service.name,
                "booking_date": booking.booking_date.strftime('%Y-%m-%d'),  # Format the date if needed
                "start_time": booking.start_time,
                "end_time": booking.end_time
            }
            booked_services.append(service_info)

    return jsonify(booked_services)

@app.route('/history')
def history():

    return render_template('history.html')