document.addEventListener('DOMContentLoaded', function () {
    // Fetch booking history from the server
    fetch('/history_data')
        .then(response => response.json())
        .then(data => {
            // Call the function to populate the history cards
            populateHistory(data);
        })
        .catch(error => {
            console.error('Error fetching booking history:', error);
        });

    // Function to populate booking history cards
    function populateHistory(bookings) {
        const historyContainer = document.querySelector('.row.row-cols-1.row-cols-md-2.g-4');
        // Clear the container before populating with new cards
        historyContainer.innerHTML = '';

        bookings.sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date));

        bookings.forEach(booking => {
            // Create a new card div and populate it with booking data
            const cardDiv = document.createElement('div');
            cardDiv.className = 'col';
            console.log('Booking ID:', booking.booking_id); // for debugging
            cardDiv.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${booking.service_name}</h5>
                        <p class="card-text">Date: ${booking.booking_date}</p>
                        <p class="card-text">Time: ${booking.start_time} - ${booking.end_time}</p>
                    </div>
                    <div class="card-footer text-muted">
                        <button type="button" class="btn btn-primary mr-2 rate-button">Rate Service</button>
                        <button type="button" class="btn btn-primary cancel-button" style="background-color: #ccc; color: #fff; border: none;" 
                            onmouseover="this.style.backgroundColor='#ff0000';" onmouseout="this.style.backgroundColor='#ccc';"
                            data-booking-id="${booking.booking_id}">Cancel Booking</button>
                    </div>
                </div>
            `;
            historyContainer.appendChild(cardDiv);

            // Add event listener to rate button
            const rateButton = cardDiv.querySelector('.rate-button');
            rateButton.addEventListener('mouseover', function () {
                this.innerHTML = '<i class="bi bi-hand-thumbs-up" style="margin-right: 15px;"></i> <i class="bi bi-hand-thumbs-down"></i>';
            });
            rateButton.addEventListener('mouseout', function () {
                this.textContent = 'Rate Service';
            });
            
            // Add event listener to cancel button
            const cancelButton = cardDiv.querySelector('.cancel-button');
            cancelButton.addEventListener('click', function() {
                const bookingId = this.getAttribute('data-booking-id');
                console.log('Booking ID:', bookingId); // for debugging
                // Send a request to the server to delete the booking with bookingId
                fetch(`/cancel_booking/${bookingId}`, {
                    method: 'DELETE'
                })
                .then(response => response.json())
                .then(data => {
                    // Handle the response as needed
                    console.log('Booking canceled:', data);
                    cardDiv.remove();
                    showFlashMessage("Booking successfully cancelled")
                    
                })
                .catch(error => {
                    console.error('Error canceling booking:', error);
                    showFlashMessage("Error cancelling booking. Please try again")
                });
            });
        });
    }
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
