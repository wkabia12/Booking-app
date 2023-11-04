const dateInput = document.getElementById('bookingDate');
const timeSlotSelect = document.getElementById('timeSlot');
const endTimeSlotSelect = document.getElementById('endTimeSlot');

dateInput.addEventListener('change', function() {
    const selectedDate = new Date(dateInput.value);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Clear existing options
    timeSlotSelect.innerHTML = '';
    endTimeSlotSelect.innerHTML = '';

    // Get current and end hours based on selected date
    let startHour = 7; // Default start hour
    let endHour = 23; // Default end hour

    if (selectedDate.getTime() === currentDate.getTime()) {
        // If selected date is today
        startHour = Math.max(currentDate.getHours(), startHour); // Start from current hour or 7am, whichever is later
    }

    // Generate time slots from startHour to endHour
    for (let i = startHour; i <= endHour; i++) {
        const formattedHour = String(i).padStart(2, '0');
        const timeSlot = `${formattedHour}:00 ${i >= 12 ? 'PM' : 'AM'}`;

        // Create option element
        const option = document.createElement('option');
        option.text = timeSlot;
        option.value = formattedHour; // Store the hour value for comparison later

        // Append the option to both start and end time slot selects
        timeSlotSelect.add(option.cloneNode(true));
        endTimeSlotSelect.add(option.cloneNode(true));
    }
});
