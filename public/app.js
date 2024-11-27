// Initialize Socket.io connection
const socket = io();

// DOM Elements
const editor = document.getElementById('editor');
const usersList = document.getElementById('users-list');
const usernameModal = document.getElementById('username-modal');
const usernameInput = document.getElementById('username-input');
const usernameSubmit = document.getElementById('username-submit');
const connectionStatus = document.getElementById('connection-status');
const boldBtn = document.getElementById('bold-btn');
const italicBtn = document.getElementById('italic-btn');
const underlineBtn = document.getElementById('underline-btn');

let username = '';
let isOnline = true;

// Show username modal on load
usernameModal.classList.add('active');

// Handle username submission
usernameSubmit.addEventListener('click', () => {
    username = usernameInput.value.trim();
    if (username) {
        usernameModal.classList.remove('active');
        socket.emit('new-user', username);
        // Show welcome message
        showNotification(`Welcome ${username}! You can start editing.`);
    } else {
        showNotification('Please enter a valid username', 'error');
    }
});

// Handle enter key in username input
usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        usernameSubmit.click();
    }
});

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }, 100);
}

// Handle text changes
let timeout = null;
editor.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        const content = editor.innerHTML;
        socket.emit('text-change', { content });
    }, 100);
});

// Receive text updates from server
socket.on('text-update', (data) => {
    if (data.user !== username) {
        editor.innerHTML = data.content;
    }
});

// Initialize document content
socket.on('init-document', (content) => {
    editor.innerHTML = content;
});

// Update users list with animations
socket.on('user-list', (users) => {
    const oldUsers = Array.from(usersList.children).map(li => li.textContent);
    const newUsers = users.map(user => `${user}${user === username ? ' (You)' : ''}`);
    
    // Remove departed users with animation
    Array.from(usersList.children).forEach(li => {
        if (!newUsers.includes(li.textContent)) {
            li.classList.add('fade-out');
            setTimeout(() => li.remove(), 300);
        }
    });
    
    // Add new users with animation
    newUsers.forEach(user => {
        if (!oldUsers.includes(user)) {
            const li = document.createElement('li');
            li.textContent = user;
            li.classList.add('fade-in');
            usersList.appendChild(li);
            setTimeout(() => li.classList.remove('fade-in'), 300);
            
            if (user.includes('(You)')) {
                li.classList.add('current-user');
            }
        }
    });
});

// Formatting buttons
boldBtn.addEventListener('click', () => {
    document.execCommand('bold', false, null);
});

italicBtn.addEventListener('click', () => {
    document.execCommand('italic', false, null);
});

underlineBtn.addEventListener('click', () => {
    document.execCommand('underline', false, null);
});

// Handle online/offline status with notifications
window.addEventListener('online', () => {
    isOnline = true;
    connectionStatus.textContent = 'Online';
    connectionStatus.className = 'online';
    showNotification('You are back online!');
    socket.connect();
});

window.addEventListener('offline', () => {
    isOnline = false;
    connectionStatus.textContent = 'Offline';
    connectionStatus.className = 'offline';
    showNotification('You are offline. Changes will be saved locally.', 'warning');
});

// Handle beforeunload event
window.addEventListener('beforeunload', () => {
    socket.disconnect();
});
