document.addEventListener('DOMContentLoaded', function() {

    // Function to generate time slots based on start and end hours
    function generateTimeSlots(start, end) {
        const timeSlots = [];
        for (let i = start; i <= end; i++) {
            const formattedHour = String(i).padStart(2, '0');
            const timeSlot = `${formattedHour}:00 ${i >= 12 ? 'PM' : 'AM'}`;
            timeSlots.push(timeSlot);
        }
        return timeSlots;
    }

    // Generate time slots from the current hour until 11 PM
    const currentHour = new Date().getHours();
    const timeSlots = generateTimeSlots(currentHour, 23);

    // Populate the dropdown menu with time slots
    const timeSlotSelect = document.getElementById('timeSlot');
    timeSlots.forEach(slot => {
        const option = document.createElement('option');
        option.text = slot;
        timeSlotSelect.add(option);
    });
});


