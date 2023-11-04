document.addEventListener('DOMContentLoaded', function () {

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

    // Get the current hour and add 1 to make it one hour ahead
    const currentHour = new Date().getHours() + 1;
    
    // Generate time slots from the updated current hour until 11 PM
    const timeSlots = generateTimeSlots(currentHour, 23);

    // Populate the dropdown menu with time slots
    const timeSlotSelect = document.getElementById('endTimeSlot');
    timeSlots.forEach(slot => {
        const option = document.createElement('option');
        option.text = slot;
        timeSlotSelect.add(option);
    });
});
