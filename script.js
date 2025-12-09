// Admin Credentials
const ADMIN_CREDENTIALS = {
    id: 'admin@zeta',
    password: 'Zeta2025@Admin'
};

// Current User State
let currentUser = null;
let isAdmin = false;
let showingAllPapers = false;

// Data Storage
let papers = [];
let channels = [];
let apps = [];

// Initialize on page load
window.onload = function() {
    loadDataFromStorage();
    checkExistingSession();
};

// ============================================
// DATA MANAGEMENT
// ============================================

function loadDataFromStorage() {
    papers = JSON.parse(localStorage.getItem('zeta_papers')) || [
        {
            id: 1,
            title: 'Quantum Computing: The Next Frontier in Scientific Research',
            photo: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
            script: 'Quantum computing represents a paradigm shift in computational technology. This paper explores the fundamental principles of quantum mechanics applied to information processing, including superposition, entanglement, and quantum gates. We examine current quantum computing architectures, their applications in cryptography, drug discovery, and optimization problems, and discuss the challenges in scaling quantum systems.',
            pdf: '',
            date: '2024-12-08'
        },
        {
            id: 2,
            title: 'Artificial Intelligence in Climate Change Prediction',
            photo: 'https://images.unsplash.com/photo-1552799446-159ba9523315?w=800',
            script: 'Machine learning and deep learning algorithms are revolutionizing climate science. This research presents novel AI models for predicting climate patterns, extreme weather events, and long-term environmental changes. We demonstrate how neural networks can process vast amounts of climate data to provide more accurate forecasts and inform policy decisions.',
            pdf: '',
            date: '2024-12-05'
        },
        {
            id: 3,
            title: 'CRISPR Gene Editing: Therapeutic Applications and Ethical Considerations',
            photo: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800',
            script: 'CRISPR-Cas9 technology has opened unprecedented possibilities in genetic medicine. This paper reviews recent advances in gene editing techniques, their applications in treating genetic disorders, cancer immunotherapy, and agricultural improvements. We also discuss the ethical implications and regulatory frameworks necessary for responsible use.',
            pdf: '',
            date: '2024-12-01'
        },
        {
            id: 4,
            title: 'Dark Matter and Dark Energy: Unveiling the Universe\'s Hidden Components',
            photo: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800',
            script: 'Dark matter and dark energy constitute approximately 95% of the universe, yet remain largely mysterious. This comprehensive study examines current theories, observational evidence from gravitational lensing, cosmic microwave background radiation, and galaxy rotation curves. We propose new experimental approaches to detect and characterize these fundamental components.',
            pdf: '',
            date: '2024-11-28'
        }
    ];

    channels = JSON.parse(localStorage.getItem('zeta_channels')) || [
        {
            id: 1,
            name: 'Science and Me',
            photo: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400',
            description: 'Exploring the wonders of science through engaging experiments and clear explanations',
            url: 'https://www.youtube.com/channel/UCfeoHl7G9SxMPj6JhZxoXHg'
        },
        {
            id: 2,
            name: 'PhysX Tech',
            photo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
            description: 'Dive deep into physics and technology with detailed tutorials and insights',
            url: 'https://youtube.com/@physxtech9?si=eEbKvR63zGX_iMFa'
        },
        {
            id: 3,
            name: 'CosmX Science',
            photo: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400',
            description: 'Journey through the cosmos and discover the mysteries of the universe',
            url: 'https://youtube.com/@cosmxscience1?si=61dfef9s-Ks8t4C-'
        }
    ];

    apps = JSON.parse(localStorage.getItem('zeta_apps')) || [
        {
            id: 1,
            name: 'ZETA Research Manager',
            features: [
                'Organize research papers efficiently',
                'AI-powered citation generator',
                'Collaborative note-taking',
                'Cloud synchronization'
            ],
            downloadUrl: 'https://www.microsoft.com/store'
        },
        {
            id: 2,
            name: 'Science Calculator Pro',
            features: [
                'Advanced scientific calculations',
                'Unit conversions and constants',
                'Graph plotting capabilities',
                'Equation solver'
            ],
            downloadUrl: 'https://www.microsoft.com/store'
        }
    ];

    saveDataToStorage();
    updateStats();
}

function saveDataToStorage() {
    localStorage.setItem('zeta_papers', JSON.stringify(papers));
    localStorage.setItem('zeta_channels', JSON.stringify(channels));
    localStorage.setItem('zeta_apps', JSON.stringify(apps));
}

function updateStats() {
    document.getElementById('paperCount').textContent = papers.length;
    document.getElementById('channelCount').textContent = channels.length;
    document.getElementById('appCount').textContent = apps.length;
}

// ============================================
// AUTHENTICATION
// ============================================

function checkExistingSession() {
    const savedUser = localStorage.getItem('zeta_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isAdmin = localStorage.getItem('zeta_admin') === 'true';
        showMainWebsite();
    }
}

function switchTab(tab) {
    const userForm = document.getElementById('userLoginForm');
    const adminForm = document.getElementById('adminLoginForm');
    const tabs = document.querySelectorAll('.tab-btn');

    tabs.forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');

    if (tab === 'user') {
        userForm.classList.add('active');
        adminForm.classList.remove('active');
    } else {
        adminForm.classList.add('active');
        userForm.classList.remove('active');
    }
}

function loginUser(event) {
    event.preventDefault();
    const name = document.getElementById('userName').value.trim();
    
    if (!name) {
        showNotification('Please enter your name', 'error');
        return;
    }

    currentUser = { name, isAdmin: false };
    localStorage.setItem('zeta_user', JSON.stringify(currentUser));
    localStorage.setItem('zeta_admin', 'false');
    
    showNotification('Welcome to ZETA, ' + name + '!', 'success');
    showMainWebsite();
}

function loginAdmin(event) {
    event.preventDefault();
    const adminId = document.getElementById('adminId').value.trim();
    const password = document.getElementById('adminPassword').value;

    if (adminId === ADMIN_CREDENTIALS.id && password === ADMIN_CREDENTIALS.password) {
        currentUser = { name: 'Admin', isAdmin: true };
        isAdmin = true;
        localStorage.setItem('zeta_user', JSON.stringify(currentUser));
        localStorage.setItem('zeta_admin', 'true');
        
        showNotification('Admin access granted!', 'success');
        showMainWebsite();
    } else {
        showNotification('Invalid admin credentials', 'error');
    }
}

function logout() {
    localStorage.removeItem('zeta_user');
    localStorage.removeItem('zeta_admin');
    currentUser = null;
    isAdmin = false;
    
    document.getElementById('mainWebsite').classList.add('hidden');
    document.getElementById('loginScreen').classList.remove('hidden');
    showNotification('Logged out successfully', 'success');
}

function showMainWebsite() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('mainWebsite').classList.remove('hidden');
    
    if (isAdmin) {
        document.getElementById('adminBtn').classList.remove('hidden');
    }
    
    loadPapers();
    loadChannels();
    loadApps();
    updateStats();
}

// ============================================
// PAPERS
// ============================================

function loadPapers(searchTerm = '') {
    let filteredPapers = papers;
    
    if (searchTerm) {
        filteredPapers = papers.filter(paper => 
            paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            paper.script.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    const papersToShow = showingAllPapers ? filteredPapers : filteredPapers.slice(0, 3);
    
    const papersHTML = papersToShow.map(paper => `
        <div class="paper-card" onclick="openPaperDetail(${paper.id})">
            <img src="${paper.photo}" alt="${paper.title}" class="paper-image" onerror="this.src='https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800'">
            <div class="paper-content">
                <h3 class="paper-title">${paper.title}</h3>
                <p class="paper-date">📅 ${paper.date}</p>
                <p class="paper-excerpt">${paper.script.substring(0, 150)}...</p>
            </div>
        </div>
    `).join('');

    document.getElementById('papersGrid').innerHTML = papersHTML || '<p style="text-align: center; color: var(--text-secondary); grid-column: 1/-1;">No papers found.</p>';

    const showMoreBtn = document.getElementById('showMoreBtn');
    if (filteredPapers.length > 3) {
        showMoreBtn.classList.remove('hidden');
        showMoreBtn.textContent = showingAllPapers ? 'Show Less' : 'Show More Papers';
    } else {
        showMoreBtn.classList.add('hidden');
    }
}

function toggleShowMore() {
    showingAllPapers = !showingAllPapers;
    loadPapers();
}

function searchPapers() {
    const searchTerm = document.getElementById('searchInput').value;
    loadPapers(searchTerm);
}

function openPaperDetail(paperId) {
    const paper = papers.find(p => p.id === paperId);
    if (!paper) return;

    const modalContent = `
        <img src="${paper.photo}" alt="${paper.title}" class="paper-detail-image" onerror="this.src='https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800'">
        <div class="paper-detail-content">
            <h2 class="paper-detail-title">${paper.title}</h2>
            <p class="paper-detail-date">📅 Published: ${paper.date}</p>
            <p class="paper-detail-text">${paper.script}</p>
            ${paper.pdf ? `
                <div class="paper-actions">
                    <a href="${paper.pdf}" target="_blank" class="btn-pdf">
                        <span>📄</span>
                        Download PDF
                    </a>
                </div>
            ` : ''}
        </div>
    `;

    document.getElementById('paperModalContent').innerHTML = modalContent;
    document.getElementById('paperModal').classList.remove('hidden');
}

function closePaperModal(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('paperModal').classList.add('hidden');
}

// ============================================
// YOUTUBE CHANNELS
// ============================================

function loadChannels() {
    const channelsHTML = channels.map(channel => `
        <div class="youtube-card">
            <img src="${channel.photo}" alt="${channel.name}" class="youtube-image" onerror="this.src='https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400'">
            <div class="youtube-content">
                <h3 class="youtube-title">${channel.name}</h3>
                <p class="youtube-desc">${channel.description}</p>
                <a href="${channel.url}" target="_blank" class="btn-youtube">Visit Channel</a>
            </div>
        </div>
    `).join('');

    document.getElementById('youtubeGrid').innerHTML = channelsHTML || '<p style="text-align: center; color: var(--text-secondary); grid-column: 1/-1;">No channels available.</p>';
}

// ============================================
// APPS
// ============================================

function loadApps() {
    const appsHTML = apps.map(app => `
        <div class="app-card">
            <h3 class="app-title">${app.name}</h3>
            <ul class="app-features">
                ${app.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            <a href="${app.downloadUrl}" target="_blank" class="btn-download">
                <span>💾</span>
                Download App
            </a>
        </div>
    `).join('');

    document.getElementById('appsGrid').innerHTML = appsHTML || '<p style="text-align: center; color: var(--text-secondary); grid-column: 1/-1;">No apps available.</p>';
}

// ============================================
// ADMIN PANEL
// ============================================

function openAdminPanel() {
    document.getElementById('mainWebsite').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('hidden');
    loadManageLists();
}

function closeAdminPanel() {
    document.getElementById('adminPanel').classList.add('hidden');
    document.getElementById('mainWebsite').classList.remove('hidden');
}

function addPaper() {
    const title = document.getElementById('adminPaperTitle').value.trim();
    const photo = document.getElementById('adminPaperPhoto').value.trim();
    const script = document.getElementById('adminPaperScript').value.trim();
    const pdf = document.getElementById('adminPaperPdf').value.trim();

    if (!title || !photo || !script) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    const newPaper = {
        id: Date.now(),
        title,
        photo,
        script,
        pdf,
        date: new Date().toISOString().split('T')[0]
    };

    papers.unshift(newPaper);
    saveDataToStorage();
    updateStats();
    
    document.getElementById('adminPaperTitle').value = '';
    document.getElementById('adminPaperPhoto').value = '';
    document.getElementById('adminPaperScript').value = '';
    document.getElementById('adminPaperPdf').value = '';
    
    showNotification('Paper added successfully!', 'success');
    loadPapers();
    loadManageLists();
}

function addChannel() {
    const name = document.getElementById('adminChannelName').value.trim();
    const photo = document.getElementById('adminChannelPhoto').value.trim();
    const description = document.getElementById('adminChannelDesc').value.trim();
    const url = document.getElementById('adminChannelUrl').value.trim();

    if (!name || !photo || !description || !url) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    const newChannel = {
        id: Date.now(),
        name,
        photo,
        description,
        url
    };

    channels.push(newChannel);
    saveDataToStorage();
    updateStats();
    
    document.getElementById('adminChannelName').value = '';
    document.getElementById('adminChannelPhoto').value = '';
    document.getElementById('adminChannelDesc').value = '';
    document.getElementById('adminChannelUrl').value = '';
    
    showNotification('Channel added successfully!', 'success');
    loadChannels();
    loadManageLists();
}

function addApp() {
    const name = document.getElementById('adminAppName').value.trim();
    const featuresText = document.getElementById('adminAppFeatures').value.trim();
    const url = document.getElementById('adminAppUrl').value.trim();

    if (!name || !featuresText || !url) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    const features = featuresText.split(',').map(f => f.trim()).filter(f => f);

    const newApp = {
        id: Date.now(),
        name,
        features,
        downloadUrl: url
    };

    apps.push(newApp);
    saveDataToStorage();
    updateStats();
    
    document.getElementById('adminAppName').value = '';
    document.getElementById('adminAppFeatures').value = '';
    document.getElementById('adminAppUrl').value = '';
    
    showNotification('App added successfully!', 'success');
    loadApps();
    loadManageLists();
}

function loadManageLists() {
    // Papers List
    const papersListHTML = papers.map(paper => `
        <div class="manage-item">
            <div>
                <strong style="color: var(--text-primary); font-size: 16px;">${paper.title}</strong>
                <p style="color: var(--text-secondary); font-size: 14px; margin-top: 5px;">📅 ${paper.date}</p>
            </div>
            <button class="btn-delete" onclick="deletePaper(${paper.id})">🗑️ Delete</button>
        </div>
    `).join('');
    document.getElementById('managePapersList').innerHTML = papersListHTML || '<p style="text-align: center; color: var(--text-secondary);">No papers available.</p>';

    // Channels List
    const channelsListHTML = channels.map(channel => `
        <div class="manage-item">
            <div>
                <strong style="color: var(--text-primary); font-size: 16px;">${channel.name}</strong>
                <p style="color: var(--text-secondary); font-size: 14px; margin-top: 5px;">${channel.description}</p>
            </div>
            <button class="btn-delete" onclick="deleteChannel(${channel.id})">🗑️ Delete</button>
        </div>
    `).join('');
    document.getElementById('manageChannelsList').innerHTML = channelsListHTML || '<p style="text-align: center; color: var(--text-secondary);">No channels available.</p>';

    // Apps List
    const appsListHTML = apps.map(app => `
        <div class="manage-item">
            <div>
                <strong style="color: var(--text-primary); font-size: 16px;">${app.name}</strong>
                <p style="color: var(--text-secondary); font-size: 14px; margin-top: 5px;">${app.features.length} features</p>
            </div>
            <button class="btn-delete" onclick="deleteApp(${app.id})">🗑️ Delete</button>
        </div>
    `).join('');
    document.getElementById('manageAppsList').innerHTML = appsListHTML || '<p style="text-align: center; color: var(--text-secondary);">No apps available.</p>';
}

function deletePaper(id) {
    if (confirm('Are you sure you want to delete this paper?')) {
        papers = papers.filter(p => p.id !== id);
        saveDataToStorage();
        updateStats();
        loadPapers();
        loadManageLists();
        showNotification('Paper deleted successfully', 'success');
    }
}

function deleteChannel(id) {
    if (confirm('Are you sure you want to delete this channel?')) {
        channels = channels.filter(c => c.id !== id);
        saveDataToStorage();
        updateStats();
        loadChannels();
        loadManageLists();
        showNotification('Channel deleted successfully', 'success');
    }
}

function deleteApp(id) {
    if (confirm('Are you sure you want to delete this app?')) {
        apps = apps.filter(a => a.id !== id);
        saveDataToStorage();
        updateStats();
        loadApps();
        loadManageLists();
        showNotification('App deleted successfully', 'success');
    }
}

// ============================================
// UTILITIES
// ============================================

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `<strong>${message}</strong>`;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
}

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePaperModal();
    }
});
