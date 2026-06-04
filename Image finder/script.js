// Note: You need a free API key from unsplash.com/developers
const API_KEY = 'rbM_kpcwPU_WHQydL_psZTmj9rMGrVuIuX1ZohHCNyE';

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const galleryGrid = document.getElementById('gallery-grid');
const errorMessage = document.getElementById('error-message');
const statusMessage = document.getElementById('status-message');
const loadMoreWrapper = document.getElementById('load-more-wrapper');
const loadMoreBtn = document.getElementById('load-more-btn');

let currentQuery = '';
let currentPage = 1;
let isLoading = false;

async function fetchImages(query, page) {
    isLoading = true;
    searchBtn.disabled = true;
    
    // Reset UI states
    errorMessage.classList.add('hidden');
    loadMoreWrapper.classList.add('hidden');
    
    if (page === 1) {
        galleryGrid.innerHTML = '';
    }

    statusMessage.textContent = 'Loading images...';
    statusMessage.classList.remove('hidden');

    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?page=${page}&query=${query}&client_id=${API_KEY}&per_page=12`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch images. Please check your API key.');
        }

        const data = await response.json();
        
        if (data.results.length === 0 && page === 1) {
            statusMessage.textContent = `No images found for "${query}".`;
        } else {
            statusMessage.classList.add('hidden');
            displayImages(data.results);
            
            // Show load more only if there are more pages available
            if (data.total_pages > page) {
                loadMoreWrapper.classList.remove('hidden');
            }
        }
    } catch (error) {
        statusMessage.classList.add('hidden');
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('hidden');
    } finally {
        isLoading = false;
        searchBtn.disabled = false;
    }
}

function displayImages(images) {
    images.forEach(image => {
        const card = document.createElement('div');
        card.className = 'image-card';
        
        const img = document.createElement('img');
        img.src = image.urls.small;
        img.alt = image.alt_description || 'Search result';
        img.loading = 'lazy'; // Native lazy loading
        
        card.appendChild(img);
        galleryGrid.appendChild(card);
    });
}

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;
    
    currentQuery = query;
    currentPage = 1;
    fetchImages(currentQuery, currentPage);
});

loadMoreBtn.addEventListener('click', () => {
    if (isLoading) return;
    currentPage++;
    fetchImages(currentQuery, currentPage);
});