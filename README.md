# Scheduling App ReadMe

## Introduction
This Flask application is designed for managing and scheduling services. Users can sign up, log in, explore available services, book appointments, and view their booking history.

## Setup
1. Install the required dependencies in flask, flask-sqlalchemyby running `python -m pip install -r packagename`.
2. Set up a MySQL database and update the `SQLALCHEMY_DATABASE_URI` in the code to match your database configuration.
3. Run the Flask application using `python app.py`.

## Database Models
### User
- Represents a registered user.
- Attributes: `id` (primary key), `username`, `email`, `password`.

### Category
- Represents a service category.
- Attributes: `id` (primary key), `name`.

### Service
- Represents a specific service within a category.
- Attributes: `id` (primary key), `name`, `description`, `category_id` (foreign key referencing `Category`).

### Booking
- Represents a user's booking for a specific service.
- Attributes: `id` (primary key), `user_id` (foreign key referencing `User`), `service_id` (foreign key referencing `Service`), `booking_date`, `start_time`, `end_time`.

## Routes
1. **Services** (`/`): Displays a landing page with randomly selected services.
2. **Sign Up** (`/signup`): Renders the sign-up page.
3. **Sign Up Post** (`/signup_post`): Handles sign-up requests via JSON, checks for duplicate usernames and emails.
4. **Login Post** (`/login_post`): Handles login requests via JSON, authenticates users based on email and password.
5. **Logout** (`/logout`): Logs the user out and redirects to the sign-up page.
6. **Services** (`/services`): Displays all service categories, services, and trending services based on user history.
7. **Get Services by Category** (`/services/<category_id>`): Retrieves services based on the selected category.
8. **Booking Form** (`/booking/<service_name>`): Renders the booking form for the selected service.
9. **Confirm Booking** (`/confirm_booking`): Confirms a booking and adds it to the database.
10. **History Data** (`/history_data`): Retrieves user booking history as JSON.
11. **History** (`/history`): Renders the user's booking history page.
12. **Cancel Booking** (`/cancel_booking/<booking_id>`): Cancels a booking based on the booking ID.

## Usage
1. Access the services page to explore available services.
2. Sign up or log in to manage bookings and view history.
3. Browse services by category and book appointments.
4. View booking history on the history page.
5. Cancel a booking if needed.