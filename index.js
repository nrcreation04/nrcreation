// List of items with their respective URLs
const items = [
  { name: "Fresh baked cake base", url: "index.html" },
  { name: "Baking Mould", url: "Bakingmould.html" },
  { name: "Edible Items", url: "Ediable items.html" },
  { name: "Compound", url: "Compound.html" },
  { name: "Packing Items", url: "Packing Items.html" },
  { name: "Toppers", url: "Toppers.html" },
  { name: "Baking Material", url: "Baking Material.html" }
];

// Function to handle search and display results
function searchItems() {
  const searchInput = document.getElementById("searchBar").value.toLowerCase();
  const searchResults = document.getElementById("searchResults");
  searchResults.innerHTML = ""; // Clear previous results

  if (searchInput.trim() === "") {
    searchResults.style.display = "none";
    return;
  }

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchInput)
  );

  if (filteredItems.length > 0) {
    searchResults.style.display = "block";
    filteredItems.forEach(item => {
      const listItem = document.createElement("li");
      listItem.textContent = item.name;
      listItem.onclick = () => {
        window.location.href = item.url; // Redirect to the selected item's page
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
