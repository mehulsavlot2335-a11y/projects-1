let currentQuote = {};
// Load favorites from localStorage, or start with an empty array
let favorites = JSON.parse(localStorage.getItem('favoriteQuotes')) || [];

// 1. Fetch a random quote from an API
async function generateQuote() {
    const quoteTextEl = document.getElementById("quote-text");
    const quoteAuthorEl = document.getElementById("quote-author");
    const newBtn = document.getElementById("new-quote-btn");

    // Set loading state
    quoteTextEl.style.opacity = "0.5";
    quoteTextEl.innerText = "Fetching new quote...";
    quoteAuthorEl.innerText = "";
    newBtn.disabled = true;
    newBtn.innerText = "Loading...";
    document.getElementById("copy-btn").innerText = "Copy"; // Reset copy button

    try {
        // Using a free public API for quotes
        const response = await fetch('https://dummyjson.com/quotes/random');
        
        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        
        // Update our current quote object
        currentQuote = {
            text: data.quote,
            author: data.author
        };

        // Update UI
        quoteTextEl.innerText = currentQuote.text;
        quoteAuthorEl.innerText = `- ${currentQuote.author}`;
    } catch (error) {
        console.error("Error fetching quote:", error);
        
        // Fallback in case the user is offline or the API fails
        currentQuote = {
            text: "The only way to do great work is to love what you do.",
            author: "Steve Jobs (Fallback)"
        };
        quoteTextEl.innerText = currentQuote.text;
        quoteAuthorEl.innerText = `- ${currentQuote.author}`;
    } finally {
        // Remove loading state
        quoteTextEl.style.opacity = "1";
        newBtn.disabled = false;
        newBtn.innerText = "New Quote";
    }
}

// 2. Copy to clipboard
function copyQuote() {
    if (!currentQuote.text) return;
    
    const fullQuote = `"${currentQuote.text}" - ${currentQuote.author}`;
    navigator.clipboard.writeText(fullQuote).then(() => {
        const copyBtn = document.getElementById("copy-btn");
        copyBtn.innerText = "Copied!";
        setTimeout(() => {
            copyBtn.innerText = "Copy";
        }, 2000);
    });
}

// 3. Save favorite
function saveFavorite() {
    if (!currentQuote.text) return;

    // Check if it's already in favorites to prevent duplicates
    const exists = favorites.some(q => q.text === currentQuote.text);
    if (!exists) {
        favorites.push(currentQuote);
        saveToLocalStorage();
        renderFavorites();
    } else {
        alert("This quote is already in your favorites!");
    }
}

// 4. Delete favorite
function deleteFavorite(index) {
    favorites.splice(index, 1);
    saveToLocalStorage();
    renderFavorites();
}

// 5. Update localStorage
function saveToLocalStorage() {
    localStorage.setItem('favoriteQuotes', JSON.stringify(favorites));
}

// 6. Render favorites list in UI
function renderFavorites() {
    const listContainer = document.getElementById("favorites-list");
    listContainer.innerHTML = ""; // Clear current list

    if (favorites.length === 0) {
        listContainer.innerHTML = `<p class="empty-message">No favorite quotes saved yet.</p>`;
        return;
    }

    favorites.forEach((quote, index) => {
        const item = document.createElement("div");
        item.className = "favorite-item";
        
        item.innerHTML = `
            <div class="favorite-text">
                "<strong>${quote.text}</strong>" <br> <em>- ${quote.author}</em>
            </div>
            <button class="delete-btn" onclick="deleteFavorite(${index})">Remove</button>
        `;
        
        listContainer.appendChild(item);
    });
}

// Initialize app on page load
window.onload = () => {
    generateQuote();
    renderFavorites();
};