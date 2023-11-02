from flask import Flask, render_template, request

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True  # Enable template auto-reloading

@app.route('/')
def login_page():
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('login-username')
    password = request.form.get('login-password')
    # login logic To Be Added
    return f'Logged in as {username}'

@app.route('/signup', methods=['POST'])
def signup():
    username = request.form.get('signup-username')
    password = request.form.get('signup-password')
    # sign-up logic To Be Added
    return f'Signed up as {username}'

if __name__ == '__main__':
    app.run(debug=True)
