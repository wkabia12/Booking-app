document.addEventListener('DOMContentLoaded', function () {
    const authForm = document.getElementById('auth-form');

    authForm.addEventListener('submit', function (event) {
        // Prevent the default form submission behavior
        event.preventDefault();

        // Get form data
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Prepare the data to be sent as JSON
        const formData = {
            username: username,
            email: email,
            password: password
        };

        // Send a POST request to the Flask route
        fetch('/signup_post', {
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
                // Sign up was successful, display success message or redirect
                console.log('Sign up successful:', data.message);
                showFlashMessage("Sign up success!! Go to login")

            } else {
                // Sign up failed, display error message to the user
                console.error('Sign up failed:', data.message);
                showFlashMessage("Sign up failed. Username or email exists!")
            }
        })
        .catch(error => {
            // Handle network errors or other issues with the request
            console.error('Error:', error);
        });
    });
});

// Function to show a flash message and redirect after a specified time
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
        window.location.reload();; // Reload the page 
    }, 3000);
}
