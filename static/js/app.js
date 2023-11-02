document.querySelectorAll(".dropdown-item").forEach(item => {
    item.addEventListener("click", function () {
        const selectedCategory = item.getAttribute("data-category-id");
        filterServices(selectedCategory);
    });
});

function filterServices(categoryId) {
    const serviceList = document.getElementById("serviceList");

    // Make an AJAX request to the Flask backend to get services based on the selected category
    fetch(`/services/${categoryId}`)
        .then(response => response.json())
        .then(services => {
            // Clear existing service list
            serviceList.innerHTML = "";

            // Populate service list with data from the database
            services.forEach(service => {
                const serviceCard = document.createElement("div");
                serviceCard.classList.add("col-md-6", "my-3");
                serviceCard.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${service.name}</h5>
                            <p class="card-text">${service.description}</p>
                            <a href="#" class="btn btn-primary">Book Now</a>
                        </div>
                    </div>
                `;
                serviceList.appendChild(serviceCard);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Initial load with "All" category
filterServices("all");


