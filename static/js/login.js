document.addEventListener('DOMContentLoaded', function () {
    const authForm = document.getElementById('auth-form');

    authForm.addEventListener('submit', function (event) {
        // Prevent the default form submission behavior
        event.preventDefault();

        // Check the form action
        const formAction = authForm.action.split('/').pop(); // Extract the last part of the URL (either 'signup' or 'login')

        // Proceed only if the form action is 'login'
        if (formAction === 'login') {
            // Get form data
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Prepare the data to be sent as JSON
            const formData = {
                email: email,
                password: password
            };

            // Send a POST request to the Flask route
            fetch('/login_post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                // Handle the response from the server
                if (data.success) {
                    // Login was successful, display success message or redirect
                    console.log('Login successful:', data.message);
                    showFlashMessage("Login successful! Redirecting...");

                    // Redirect to the desired page (for example, dashboard)
                    setTimeout(() => {
                        window.location.href = '/services';
                    }, 3000);
                } else {
                    // Login failed, display error message to the user
                    console.error('Login failed:', data.message);
                    showFlashMessage("Login failed. Invalid email or password.");
                }
            })
            .catch(error => {
                // Handle network errors or other issues with the request
                console.error('Error:', error);
            });
        }
    });

    // Function to show a flash message
    function showFlashMessage(message) {
        const flashMessageContainer = document.getElementById('flash-message-container');
        const flashMessage = document.createElement('div');
        flashMessage.className = 'alert alert-success alert-dismissible fade show d-flex justify-content-center align-items-center fixed-top';
        flashMessage.role = 'alert';
        flashMessage.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        flashMessageContainer.appendChild(flashMessage);

        // Remove the flash message after 5 seconds (5000 milliseconds)
        setTimeout(() => {
            flashMessage.remove();
        }, 5000);
    }
});