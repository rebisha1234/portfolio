// Load gallery images from localStorage
function loadGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    const images = JSON.parse(localStorage.getItem('galleryImages')) || [];
    
    if (images.length === 0) {
        galleryGrid.innerHTML = '<p style="text-align: center; padding: 2rem; grid-column: 1/-1;">No images yet. Add some from the admin panel!</p>';
        return;
    }
    
    galleryGrid.innerHTML = images.map(img => `
        <div class="gallery-item">
            <img src="${img.url}" alt="${img.caption}">
            <div class="caption">
                <p>${img.caption}</p>
            </div>
        </div>
    `).join('');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadGallery);
