// Define the pages and corresponding item lists (preloaded for simplicity)
const pagesWithItems = {
  "Bakingmould.html": ["Heart Shape", "2 Pound", "3 Pound", "Square mould"],
  "Ediable items.html": ["Cherry", "Maple Syrup", "Agave Syrup", "Strawberry crush", ],
  "Compound.html": ["2M White Compound", "2M Milk Compound", "Tropolite", "2M Dark Compound 2 pack"],
};

// Combine all items into a single searchable list with their respective URLs
const allItems = Object.entries(pagesWithItems).flatMap(([url, items]) =>
  items.map(item => ({ name: item, url }))
);

// Function to handle search and display results
function searchItems() {
  const searchInput = document.getElementById("searchBar").value.toLowerCase();
  const searchResults = document.getElementById("searchResults");
  searchResults.innerHTML = ""; // Clear previous results

  if (searchInput.trim() === "") {
    searchResults.style.display = "none";
    return;
  }

  // Filter items based on the search input
  const filteredItems = allItems.filter(item =>
    item.name.toLowerCase().includes(searchInput)
  );

  if (filteredItems.length > 0) {
    searchResults.style.display = "block";
    filteredItems.forEach(item => {
      const listItem = document.createElement("li");
      listItem.textContent = item.name;
      listItem.onclick = () => {
        window.location.href = item.url; // Redirect to the respective page
      };
      searchResults.appendChild(listItem);
    });
  } else {
    searchResults.style.display = "block";
    const noResultItem = document.createElement("li");
    noResultItem.textContent = "No items found.";
    noResultItem.style.color = "#888";
    searchResults.appendChild(noResultItem);
  }
}

// Close search results dropdown when clicked outside
document.addEventListener("click", (e) => {
  const searchContainer = document.querySelector(".search-container");
  const searchResults = document.getElementById("searchResults");
  if (!searchContainer.contains(e.target)) {
    searchResults.style.display = "none";
  }
});
