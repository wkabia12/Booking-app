from flask import  request
from flask import render_template, jsonify
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from flask import session
from flask import redirect, url_for

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:password@localhost:3306/scheduling_app'
app.config['SECRET_KEY'] = '3b96c64401d7'
SQLALCHEMY_TRACK_MODIFICATIONS = False
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(45), unique=True, nullable=False)
    email = db.Column(db.String(255),unique=True, nullable=False)
    password = db.Column(db.String(45), nullable=False)

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password


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



@app.route('/signup', methods=['GET'])
def signup():

    return render_template('login_signup.html')

# Route to handle sign-up requests
@app.route('/signup_post', methods=['POST'])
def signup_post():
    data = request.get_json()

    # Extract data from the JSON request
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')


    # Check if username or email already exists in the database
    existing_user = User.query.filter_by(username=username).first()
    existing_email = User.query.filter_by(email=email).first()

    if existing_user or existing_email:
        # Username or email already exists, return failure response
        return jsonify(success=False, message='Sign up failed. Username or email already exists.'), 400
    else:
        # Username and email are unique, create a new user in the database
        new_user = User(username=username, email=email, password=password)
        db.session.add(new_user)
        db.session.commit()

        # Sign up successful, return success response
        return jsonify(success=True, message='Sign up successful. Welcome, {}!'.format(username)), 200
    
# Login route
@app.route('/login_post', methods=['POST'])
def login():
    data = request.get_json()

    # Extract data from the JSON request
    email = data.get('email')
    password = data.get('password')

    # Check if the email exists in the database
    user = User.query.filter_by(email=email).first()

    if user and user.password == password:
        session['user_id'] = user.id 
        # User exists and password matches, return success response
        return jsonify(success=True, message='Login successful. Welcome, {}!'.format(user.username)), 200
    else:
        # Invalid credentials, return failure response
        return jsonify(success=False, message='Invalid username or password.'), 401
    
@app.route('/logout')
def logout():
    # Remove user_id from the session if it's there
    session.pop('user_id', None)
    # Redirect to the signup page
    return redirect(url_for('signup'))    


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

    user_id = session.get('user_id')  # Get user ID from session
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
    user_id = session.get('user_id')  # Get user ID from session
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
                "end_time": booking.end_time,
                "booking_id": booking.id
            }
            booked_services.append(service_info)

    return jsonify(booked_services)

@app.route('/history')
def history():

    return render_template('history.html')

# API route to cancel booking by ID
@app.route('/cancel_booking/<int:booking_id>', methods=['DELETE'])
def cancel_booking(booking_id):
    booking_to_cancel = Booking.query.get(booking_id)

    if booking_to_cancel:
        db.session.delete(booking_to_cancel)
        db.session.commit()
        return jsonify(message='Booking canceled successfully'), 200
    else:
        return jsonify(message='Booking not found'), 404