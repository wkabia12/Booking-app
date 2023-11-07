document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('confirmBookingButton').addEventListener('click', function () {
        var serviceNameElement = document.getElementById('serviceName').textContent.trim();
        var serviceName = serviceNameElement.replace('Booking for ', '').trim();

        const selectedDate = document.getElementById('bookingDate').value;
        const timeSlotElement = document.getElementById('timeSlot');
        const selectedStartTime = timeSlotElement.options[timeSlotElement.selectedIndex].textContent;

        const endTimeSlotElement = document.getElementById('endTimeSlot');
        const selectedEndTime = endTimeSlotElement.options[endTimeSlotElement.selectedIndex].textContent;


        const bookingData = {
            service_name: serviceName,
            booking_date: selectedDate,
            start_time: selectedStartTime,
            end_time: selectedEndTime,
        };

        fetch('/confirm_booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message); // Log the response message for debugging purposes

            if (data.message) {
                showFlashMessage('Booking successful! Please wait as we redirect you to your history'); // Show flash message for 5 seconds
            } else {
                showFlashMessage('Booking failed. Please try again.'); // Show error message for 5 seconds
                window.location.reload()
            }
        })
        .catch(error => {
            console.error('Error confirming booking:', error);
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
        window.location.href = '/history'; // Redirect to the history page
    }, 3000);
}