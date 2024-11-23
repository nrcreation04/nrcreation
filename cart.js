// IndexedDB setup
let db;

const request = indexedDB.open("CartDB", 1);

request.onerror = function (event) {
    console.error("Database error:", event.target.errorCode);
};

request.onsuccess = function (event) {
    db = event.target.result;
    console.log("Database opened successfully");
    loadCartItems();
};

request.onupgradeneeded = function (event) {
    db = event.target.result;
    db.createObjectStore("cartItems", { keyPath: "id" });
    console.log("Database setup complete");
};

// Load cart items from IndexedDB
function loadCartItems() {
    const transaction = db.transaction("cartItems", "readonly");
    const objectStore = transaction.objectStore("cartItems");
    const request = objectStore.getAll();

    request.onsuccess = function () {
        const cartItems = request.result || [];
        if (cartItems.length === 0) {
            document.getElementById("cartGrid").innerHTML = "<p>Your cart is empty.</p>";
        } else {
            displayCartItems(cartItems);
        }
    };
}

// Display cart items
function displayCartItems(items) {
    const cartGrid = document.getElementById("cartGrid");
    cartGrid.innerHTML = ""; // Clear existing items

    items.forEach((item) => {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <div class="item-details">
                <h3>${item.name}</h3>
                <img src="${item.image}" alt="${item.name}">
                <div class="qty-container">
                    <button class="qty-button" onclick="decreaseQty(${item.id})">-</button>
                    <div class="qty-display" id="qty-${item.id}">${item.qty}</div>
                    <button class="qty-button" onclick="increaseQty(${item.id})">+</button>
                </div>
                <button class="remove-item" onclick="removeItem(${item.id})">Remove</button>
            </div>
        `;

        cartGrid.appendChild(cartItem);
    });
}

// Increase item quantity
function increaseQty(itemId) {
    updateQty(itemId, 1);
}

// Decrease item quantity
function decreaseQty(itemId) {
    updateQty(itemId, -1);
}

// Update item quantity
function updateQty(itemId, change) {
    const transaction = db.transaction("cartItems", "readwrite");
    const objectStore = transaction.objectStore("cartItems");
    const request = objectStore.get(itemId);

    request.onsuccess = function () {
        const item = request.result;
        if (item) {
            item.qty += change;
            if (item.qty <= 0) {
                removeItem(itemId);
            } else {
                objectStore.put(item); // Update item in IndexedDB
                document.getElementById(`qty-${itemId}`).innerText = item.qty; // Update UI
            }
        }
    };
}

// Remove item from cart
function removeItem(itemId) {
    const transaction = db.transaction("cartItems", "readwrite");
    const objectStore = transaction.objectStore("cartItems");
    objectStore.delete(itemId);

    transaction.oncomplete = function () {
        loadCartItems(); // Reload cart items
    };
}

// Place order
function placeOrder() {
    const transaction = db.transaction("cartItems", "readonly");
    const objectStore = transaction.objectStore("cartItems");
    const request = objectStore.getAll();

    request.onsuccess = function () {
        const cartItems = request.result || [];
        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        // Construct order message
        let orderMessage = "I would like to place the following order:\n\n";
        cartItems.forEach((item, index) => {
            orderMessage += `${index + 1}. ${item.name} - Quantity: ${item.qty}\n`;
        });

        // WhatsApp integration
        const phoneNumber = "9330705892"; // Replace with your WhatsApp number
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(orderMessage)}`;
        window.open(whatsappUrl, "_blank");
    };
}

// Go back to home page
function goBack() {
    window.location.href = "index.html";
}

// Load cart items on page load
document.addEventListener("DOMContentLoaded", loadCartItems);
