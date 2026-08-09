const filters = document.querySelectorAll(".filter");

filters.forEach((filter) => {
    filter.addEventListener("click", () => {

        // Remove active class
        filters.forEach((item) => {
            item.classList.remove("active");
        });

        // Add active class
        filter.classList.add("active");

        // Get selected category
        const category = filter.dataset.category;

        console.log("Selected category:", category);
    });
});