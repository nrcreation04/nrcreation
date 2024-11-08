// List of items (can come from an API or backend)
const items = [
    { id: 1, name: "Heart Shape", image: "item1.jpg", qty: 0 },
    { id: 2, name: "2 Pound", image: "item2.jpg", qty: 0 },
    { id: 3, name: "3 Pound", image: "item3.jpeg", qty: 0 },
    { id: 4, name: "Square mould", image: "item4.jpg", qty: 0 },
];

// Store items in the cart
let cart = JSON.parse(localStorage.getItem('cartItems')) || [];

// Function to display the items
function displayItems(itemsToShow) {
    const itemGrid = document.getElementById('itemGrid');
    itemGrid.innerHTML = ''; // Clear the grid first

    if (itemsToShow.length === 0) {
        itemGrid.innerHTML = `<p>No items found.</p>`;
        return;
    }

    itemsToShow.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';

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
    const item = items.find(item => item.id === itemId);
    if (item) {
        item.qty += 1;
        document.getElementById(`qty-${itemId}`).innerText = item.qty;
    }
}

function decreaseQty(itemId) {
    const item = items.find(item => item.id === itemId);
    if (item && item.qty > 0) {
        item.qty -= 1;
        document.getElementById(`qty-${itemId}`).innerText = item.qty;
    }
}

// Function to add all selected items to the cart
function addAllToCart() {
    const selectedItems = items.filter(item => item.qty > 0); // Get items with non-zero qty
    if (selectedItems.length > 0) {
        selectedItems.forEach(item => {
            const existingItem = cart.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                existingItem.qty = item.qty; // Update qty if already in cart
            } else {
                cart.push({ ...item }); // Add new item to the cart
            }
        });
        localStorage.setItem('cartItems', JSON.stringify(cart)); // Save cart in local storage
        alert('Selected items have been added to your cart!');
    } else {
        alert('Please select quantities for items before adding to cart.');
    }
}

// Function for searching items
document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchText = e.target.value.toLowerCase();
    const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchText));
    displayItems(filteredItems);
});

// Initial display of items
displayItems(items);

// Navigation functions
function goHome() {
    // Redirect to the home page (if needed)
    window.location.href = 'index.html';
}

function goCart() {
    // Redirect to the cart page
    window.location.href = 'cart.html';
}
