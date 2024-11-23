// List of items (can come from an API or backend)
const items = [
    { id: 1, name: "2M Dark Compound", image: "item21.jpeg", qty: 0 },
    { id: 2, name: "2M White Compound", image: "item22.jpeg", qty: 0 },
    { id: 3, name: "2M Milk Compound", image: "item23.jpg", qty: 0 },
    { id: 4, name: "Tropolite", image: "item24.jpg", qty: 0 },
    { id: 5, name: "2M Dark Compound 2 pack", image: "item21.jpeg", qty: 0 },

];

// IndexedDB setup
let db;

const request = indexedDB.open("CartDB", 1);

request.onerror = function (event) {
    console.error("Database error:", event.target.errorCode);
};

request.onsuccess = function (event) {
    db = event.target.result;
    console.log("Database opened successfully");
    loadCart();
};

request.onupgradeneeded = function (event) {
    db = event.target.result;
    const objectStore = db.createObjectStore("cartItems", { keyPath: "id" });
    console.log("Database setup complete");
};

// Load cart data from IndexedDB
function loadCart() {
    const transaction = db.transaction("cartItems", "readonly");
    const objectStore = transaction.objectStore("cartItems");
    const request = objectStore.getAll();

    request.onsuccess = function () {
        const cart = request.result || [];
        cart.forEach((item) => {
            const originalItem = items.find((i) => i.id === item.id);
            if (originalItem) {
                originalItem.qty = item.qty; // Sync quantities
            }
        });
        displayItems(items); // Display updated items
    };
}

// Function to display the items
function displayItems(itemsToShow) {
    const itemGrid = document.getElementById("itemGrid");
    itemGrid.innerHTML = ""; // Clear the grid first

    if (itemsToShow.length === 0) {
        itemGrid.innerHTML = `<p>No items found.</p>`;
        return;
    }

    itemsToShow.forEach((item) => {
        const itemCard = document.createElement("div");
        itemCard.className = "item-card";

        itemCard.innerHTML = `
            <h3>${item.name}</h3>
            <img src="${item.image}" alt="${item.name}">
            <div class="qty-container">
                <button class="qty-button" onclick="decreaseQty(${item.id})">-</button>
                <div class="qty-display" id="qty-${item.id}">${item.qty}</div>
                <button class="qty-button" onclick="increaseQty(${item.id})">+</button>
            </div>
        `;
        itemGrid.appendChild(itemCard);
    });
}

// Functions to increase or decrease quantity
function increaseQty(itemId) {
    const item = items.find((item) => item.id === itemId);
    if (item) {
        item.qty += 1;
        document.getElementById(`qty-${itemId}`).innerText = item.qty;
    }
}

function decreaseQty(itemId) {
    const item = items.find((item) => item.id === itemId);
    if (item && item.qty > 0) {
        item.qty -= 1;
        document.getElementById(`qty-${itemId}`).innerText = item.qty;
    }
}

// Function to add all selected items to the cart
function addAllToCart() {
    const selectedItems = items.filter((item) => item.qty > 0); // Get items with non-zero qty

    if (selectedItems.length > 0) {
        const transaction = db.transaction("cartItems", "readwrite");
        const objectStore = transaction.objectStore("cartItems");

        selectedItems.forEach((item) => {
            objectStore.put(item); // Update or add the item in IndexedDB
        });

        transaction.oncomplete = function () {
            alert("Selected items have been added to your cart!");
        };

        transaction.onerror = function () {
            alert("An error occurred while adding items to the cart.");
        };
    } else {
        alert("Please select quantities for items before adding to cart.");
    }
}

// Function for searching items
document.getElementById("searchInput").addEventListener("input", function (e) {
    const searchText = e.target.value.toLowerCase();
    const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(searchText)
    );
    displayItems(filteredItems);
});

// Navigation functions
function goHome() {
    // Redirect to the home page (if needed)
    window.location.href = "index.html";
}

function goCart() {
    // Redirect to the cart page
    window.location.href = "cart.html";
}

// Initial display of items
document.addEventListener("DOMContentLoaded", () => {
    loadCart(); // Load cart items on page load
});
