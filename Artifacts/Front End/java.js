document.addEventListener('DOMContentLoaded', function () {
    setupSearch();
    setupModalOptions();
    setupItemRemoval();
});

function setupSearch() {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', function () {
            const searchTerm = searchInput.value;
            alert('Searching for: ' + searchTerm);
        });
    }
}

function setupModalOptions() {
    const moreOptionsButton = document.querySelector(".more-options-button");
    if (moreOptionsButton) {
        moreOptionsButton.addEventListener("click", function () {
            const modalContainer = document.querySelector(".modal-container-initial");
            const newContentDiv = document.getElementById("modal-container-more");
            if (modalContainer && newContentDiv) {
                modalContainer.innerHTML = newContentDiv.innerHTML;
            }
        });
    }
}

function setupItemRemoval() {
    document.body.addEventListener('click', function (event) {
        console.log("Clicked element:", event.target);  // Debug which element was clicked
        if (event.target.classList.contains('thrown-button') || event.target.classList.contains('eaten-button')) {
            const inventoryItem = event.target.closest('.inventory-items-container');
            console.log("Inventory item to remove:", inventoryItem);  // Debug the selection
            if (inventoryItem) {
                inventoryItem.remove();
                alert('Item has been removed from inventory');
            }
        }
    });
}
