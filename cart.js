// Load cart items from localStorage if available; otherwise, initialize an empty array
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// Function to save cart items to localStorage
function saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Function to display cart items on the page
function displayCartItems() {
    const cartGrid = document.getElementById('cartGrid');
    cartGrid.innerHTML = ''; // Clear existing items

    // If cart is empty, show a message
    if (cartItems.length === 0) {
        cartGrid.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    // Loop through items and create HTML elements for each
    cartItems.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        cartItem.innerHTML = `
            <div class="item-info">
                <span class="item-name">${item.name}</span>
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="qty-container">
                <button onclick="updateQuantity(${index}, -1)">-</button>
                <span>${item.qty}</span>
                <button onclick="updateQuantity(${index}, 1)">+</button>
            </div>
            <button class="remove-item" onclick="removeItem(${index})">Remove</button>
        `;
        cartGrid.appendChild(cartItem);
    });
}

// Function to update quantity of an item in the cart
function updateQuantity(index, change) {
    // Only update if the resulting quantity is positive
    if (cartItems[index].qty + change > 0) {
        cartItems[index].qty += change;
        saveCart(); // Save updated cart to localStorage
        displayCartItems(); // Refresh the cart display
    }
}

// Function to remove an item from the cart
function removeItem(index) {
    cartItems.splice(index, 1); // Remove item at the specified index
    saveCart(); // Save updated cart to localStorage
    displayCartItems(); // Refresh the cart display
}

// Function to navigate back to the shop (assumes 'index.html' is the shop page)
function goBack() {
    window.location.href = 'index.html';
}

// Function to place order and redirect to WhatsApp with order details
function placeOrder() {
    const pickupDateTime = document.getElementById('pickupDateTime').value;

    if (!pickupDateTime) {
        alert('Please select a pickup date and time.');
        return;
    }

    // Construct the order message
    let orderMessage = 'I would like to Order the below items:\n\n';
    cartItems.forEach(item => {
        orderMessage += `${item.name} - Quantity: ${item.qty}\n`;
    });
    orderMessage += `Pickup Date & Time: ${pickupDateTime}`;

    // Redirect to WhatsApp with the encoded message
    const whatsappUrl = `https://wa.me/9330705892?text=${encodeURIComponent(orderMessage)}`;
    window.open(whatsappUrl, '_blank');
}

// Initialize cart display when the page loads
displayCartItems();
