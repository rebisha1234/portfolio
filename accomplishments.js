// Load accomplishments from localStorage
function loadAccomplishments() {
    const accomplishmentsList = document.getElementById('accomplishmentsList');
    const accomplishments = JSON.parse(localStorage.getItem('accomplishments')) || [];
    
    if (accomplishments.length === 0) {
        accomplishmentsList.innerHTML = '<p style="text-align: center; padding: 2rem;">No accomplishments yet. Add some from the admin panel!</p>';
        return;
    }
    
    accomplishmentsList.innerHTML = accomplishments.map(acc => `
        <div class="accomplishment-item">
            ${acc.imageUrl ? `<img src="${acc.imageUrl}" alt="${acc.title}">` : ''}
            <div class="accomplishment-content">
                <h3>${acc.title}</h3>
                <p><strong>Date:</strong> ${new Date(acc.date).toLocaleDateString()}</p>
                <p>${acc.description}</p>
            </div>
        </div>
    `).join('');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadAccomplishments);
