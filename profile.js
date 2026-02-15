// Load profile data
function loadProfile() {
    const profileSection = document.getElementById('profileSection');
    const profile = JSON.parse(localStorage.getItem('profileData')) || getDefaultProfile();
    
    profileSection.innerHTML = `
        <div class="profile-image-container">
            <img src="${profile.photo}" alt="${profile.name}">
        </div>
        <div class="profile-info">
            <h1>${profile.name}</h1>
            <p class="title">${profile.title}</p>
            <div style="display: flex; justify-content: center; width: 100%;">
                <p class="subtitle typing" id="subtitleText"></p>
            </div>
            <a href="about.html" class="btn">Learn More</a>
        </div>
    `;
    
    // Start continuous typewriter effect
    const subtitleElement = document.getElementById('subtitleText');
    const text = profile.subtitle;
    let index = 0;
    let isDeleting = false;
    
    function typeWriter() {
        if (!isDeleting && index < text.length) {
            // Typing forward
            subtitleElement.textContent = text.substring(0, index + 1);
            index++;
            setTimeout(typeWriter, 100);
        } else if (!isDeleting && index === text.length) {
            // Pause at end before deleting
            setTimeout(() => {
                isDeleting = true;
                typeWriter();
            }, 2000);
        } else if (isDeleting && index > 0) {
            // Deleting backward
            subtitleElement.textContent = text.substring(0, index - 1);
            index--;
            setTimeout(typeWriter, 50);
        } else if (isDeleting && index === 0) {
            // Pause at start before typing again
            isDeleting = false;
            setTimeout(typeWriter, 500);
        }
    }
    
    // Start after initial delay
    setTimeout(typeWriter, 1000);
}

// Default profile data
function getDefaultProfile() {
    return {
        name: 'Rebisha Rana',
        title: 'Bachelor in Technical Education and Information Technology',
        subtitle: 'Teaching Internship at Xavier College',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
    };
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadProfile);
