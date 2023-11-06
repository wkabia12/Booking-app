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
        historyContainer.innerHTML = ''

        bookings.sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date));

        // Iterate through the bookings and create cards
        bookings.forEach(booking => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'col';
            cardDiv.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${booking.service_name}</h5>
                        <p class="card-text">Date: ${booking.booking_date}</p>
                        <p class="card-text">Time: ${booking.start_time} - ${booking.end_time}</p>
                    </div>
                    <div class="card-footer text-muted">
                        <button type="button" class="btn btn-primary mr-2">Rate Service</button>
                        <button type="button" class="btn btn-primary" style="background-color: #ccc; color: #fff; border: none;">Cancel Booking</button>
                    </div>
                    </div>
                </div>
            `;
            historyContainer.appendChild(cardDiv);
        });
    }
});

