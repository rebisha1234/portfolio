// Tab switching
function showTab(tabName, clickedButton) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(`${tabName}-tab`).classList.add('active');
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
}

// Helper function to convert file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Profile Management
function loadProfileAdmin() {
    const profile = JSON.parse(localStorage.getItem('profileData')) || getDefaultProfile();
    
    // Populate form
    document.getElementById('profileName').value = profile.name;
    document.getElementById('profileTitle').value = profile.title;
    document.getElementById('profileSubtitle').value = profile.subtitle;
    
    // Show preview
    updateProfilePreview(profile);
}

function getDefaultProfile() {
    return {
        name: 'Rebisha Rana',
        title: 'Bachelor in Technical Education and Information Technology',
        subtitle: 'Teaching Internship at Xavier College',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
    };
}

function updateProfilePreview(profile) {
    const preview = document.getElementById('profilePreview');
    preview.innerHTML = `
        <div class="profile-preview-image">
            <img src="${profile.photo}" alt="${profile.name}">
        </div>
        <h2>${profile.name}</h2>
        <p>${profile.title}</p>
        <p>${profile.subtitle}</p>
    `;
}

document.getElementById('updateProfileForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const photoFile = document.getElementById('profilePhotoFile').files[0];
    
    if (!photoFile) {
        alert('Please upload a profile photo');
        return;
    }
    
    const photoUrl = await fileToBase64(photoFile);
    
    const profile = {
        name: document.getElementById('profileName').value,
        title: document.getElementById('profileTitle').value,
        subtitle: document.getElementById('profileSubtitle').value,
        photo: photoUrl
    };
    
    localStorage.setItem('profileData', JSON.stringify(profile));
    updateProfilePreview(profile);
    alert('Profile updated successfully! Refresh the home page to see changes.');
    
    // Clear file input
    document.getElementById('profilePhotoFile').value = '';
});

// Gallery Management
function loadGalleryAdmin() {
    const galleryList = document.getElementById('galleryList');
    const images = JSON.parse(localStorage.getItem('galleryImages')) || [];
    
    if (images.length === 0) {
        galleryList.innerHTML = '<p style="text-align: center; padding: 2rem;">No images yet. Add some above!</p>';
        return;
    }
    
    galleryList.innerHTML = images.map(img => `
        <div class="item-card" data-id="${img.id}">
            <img src="${img.url}" alt="${img.caption}">
            <div class="item-info">
                <h4>${img.caption}</h4>
                <p><strong>Type:</strong> ${img.url.startsWith('data:') ? 'Uploaded Image' : 'External URL'}</p>
            </div>
            <div class="item-actions">
                <button class="btn-edit" onclick="editGalleryItem(${img.id})">Edit</button>
                <button class="btn-delete" onclick="deleteGalleryItem(${img.id})">Delete</button>
            </div>
        </div>
    `).join('');
}


document.getElementById('addGalleryForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const imageFile = document.getElementById('galleryImageFile').files[0];
    
    if (!imageFile) {
        alert('Please upload an image');
        return;
    }
    
    const imageUrl = await fileToBase64(imageFile);
    
    const images = JSON.parse(localStorage.getItem('galleryImages')) || [];
    const newImage = {
        id: Date.now(),
        url: imageUrl,
        caption: document.getElementById('galleryCaption').value
    };
    
    images.push(newImage);
    localStorage.setItem('galleryImages', JSON.stringify(images));
    
    this.reset();
    loadGalleryAdmin();
    alert('Image added successfully!');
});

function deleteGalleryItem(id) {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    let images = JSON.parse(localStorage.getItem('galleryImages')) || [];
    images = images.filter(img => img.id !== id);
    localStorage.setItem('galleryImages', JSON.stringify(images));
    loadGalleryAdmin();
}

function editGalleryItem(id) {
    const images = JSON.parse(localStorage.getItem('galleryImages')) || [];
    const image = images.find(img => img.id === id);
    
    if (!image) return;
    
    const card = document.querySelector(`[data-id="${id}"]`);
    
    card.innerHTML = `
        <img src="${image.url}" alt="${image.caption}">
        <div class="edit-form">
            <label style="font-weight: bold;">Upload New Image (optional):</label>
            <input type="file" id="edit-file-${id}" accept="image/*" style="padding: 0.5rem;">
            <input type="text" id="edit-caption-${id}" value="${image.caption}" placeholder="Caption">
            <div class="edit-actions">
                <button class="btn-save" onclick="saveGalleryEdit(${id})">Save</button>
                <button class="btn-cancel" onclick="loadGalleryAdmin()">Cancel</button>
            </div>
        </div>
    `;
}

async function saveGalleryEdit(id) {
    const images = JSON.parse(localStorage.getItem('galleryImages')) || [];
    const index = images.findIndex(img => img.id === id);
    
    if (index === -1) return;
    
    const imageFile = document.getElementById(`edit-file-${id}`).files[0];
    
    // If file is uploaded, use it; otherwise keep existing
    if (imageFile) {
        images[index].url = await fileToBase64(imageFile);
    }
    
    images[index].caption = document.getElementById(`edit-caption-${id}`).value;
    
    localStorage.setItem('galleryImages', JSON.stringify(images));
    loadGalleryAdmin();
    alert('Image updated successfully!');
}

// Accomplishments Management
function loadAccomplishmentsAdmin() {
    const accomplishmentsList = document.getElementById('accomplishmentsList');
    const accomplishments = JSON.parse(localStorage.getItem('accomplishments')) || [];
    
    if (accomplishments.length === 0) {
        accomplishmentsList.innerHTML = '<p style="text-align: center; padding: 2rem;">No accomplishments yet. Add some above!</p>';
        return;
    }
    
    accomplishmentsList.innerHTML = accomplishments.map(acc => `
        <div class="item-card" data-id="${acc.id}">
            ${acc.imageUrl ? `<img src="${acc.imageUrl}" alt="${acc.title}">` : '<div style="width: 150px;"></div>'}
            <div class="item-info">
                <h4>${acc.title}</h4>
                <p><strong>Date:</strong> ${new Date(acc.date).toLocaleDateString()}</p>
                <p>${acc.description}</p>
            </div>
            <div class="item-actions">
                <button class="btn-edit" onclick="editAccomplishment(${acc.id})">Edit</button>
                <button class="btn-delete" onclick="deleteAccomplishment(${acc.id})">Delete</button>
            </div>
        </div>
    `).join('');
}


document.getElementById('addAccomplishmentForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const imageFile = document.getElementById('accomplishmentImageFile').files[0];
    let imageUrl = '';
    
    // Image is optional for accomplishments
    if (imageFile) {
        imageUrl = await fileToBase64(imageFile);
    }
    
    const accomplishments = JSON.parse(localStorage.getItem('accomplishments')) || [];
    const newAccomplishment = {
        id: Date.now(),
        title: document.getElementById('accomplishmentTitle').value,
        description: document.getElementById('accomplishmentDescription').value,
        imageUrl: imageUrl,
        date: document.getElementById('accomplishmentDate').value
    };
    
    accomplishments.push(newAccomplishment);
    localStorage.setItem('accomplishments', JSON.stringify(accomplishments));
    
    this.reset();
    loadAccomplishmentsAdmin();
    alert('Accomplishment added successfully!');
});

function deleteAccomplishment(id) {
    if (!confirm('Are you sure you want to delete this accomplishment?')) return;
    
    let accomplishments = JSON.parse(localStorage.getItem('accomplishments')) || [];
    accomplishments = accomplishments.filter(acc => acc.id !== id);
    localStorage.setItem('accomplishments', JSON.stringify(accomplishments));
    loadAccomplishmentsAdmin();
}

function editAccomplishment(id) {
    const accomplishments = JSON.parse(localStorage.getItem('accomplishments')) || [];
    const acc = accomplishments.find(a => a.id === id);
    
    if (!acc) return;
    
    const card = document.querySelector(`[data-id="${id}"]`);
    
    card.innerHTML = `
        <div class="edit-form" style="width: 100%;">
            <input type="text" id="edit-title-${id}" value="${acc.title}" placeholder="Title">
            <textarea id="edit-desc-${id}" rows="4" placeholder="Description">${acc.description}</textarea>
            <label style="font-weight: bold;">Upload New Image (optional):</label>
            <input type="file" id="edit-file-${id}" accept="image/*" style="padding: 0.5rem;">
            <input type="date" id="edit-date-${id}" value="${acc.date}">
            <div class="edit-actions">
                <button class="btn-save" onclick="saveAccomplishmentEdit(${id})">Save</button>
                <button class="btn-cancel" onclick="loadAccomplishmentsAdmin()">Cancel</button>
            </div>
        </div>
    `;
}

async function saveAccomplishmentEdit(id) {
    const accomplishments = JSON.parse(localStorage.getItem('accomplishments')) || [];
    const index = accomplishments.findIndex(acc => acc.id === id);
    
    if (index === -1) return;
    
    const imageFile = document.getElementById(`edit-file-${id}`).files[0];
    
    // If file is uploaded, use it; otherwise keep existing
    if (imageFile) {
        accomplishments[index].imageUrl = await fileToBase64(imageFile);
    }
    
    accomplishments[index].title = document.getElementById(`edit-title-${id}`).value;
    accomplishments[index].description = document.getElementById(`edit-desc-${id}`).value;
    accomplishments[index].date = document.getElementById(`edit-date-${id}`).value;
    
    localStorage.setItem('accomplishments', JSON.stringify(accomplishments));
    loadAccomplishmentsAdmin();
    alert('Accomplishment updated successfully!');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadProfileAdmin();
    loadGalleryAdmin();
    loadAccomplishmentsAdmin();
});
