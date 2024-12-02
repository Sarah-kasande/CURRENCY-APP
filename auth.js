// Authentication Logic
class AuthManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = null;
    }

    // User Registration
    register(username, email, password) {
        // Check if user already exists
        if (this.users.some(user => user.email === email)) {
            return { success: false, message: 'Email already registered' };
        }

        // Create new user object
        const newUser = {
            username,
            email,
            password: this.hashPassword(password),
            createdAt: new Date()
        };

        // Add user and save to local storage
        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));

        return { success: true, message: 'Registration successful' };
    }

    // User Login
    login(email, password) {
        const user = this.users.find(u => u.email === email);
        
        if (!user) {
            return { success: false, message: 'User not found' };
        }

        if (user.password !== this.hashPassword(password)) {
            return { success: false, message: 'Incorrect password' };
        }

        // Set current user
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));

        return { success: true, message: 'Login successful' };
    }

    // Simple password hashing (Note: Use more secure methods in production)
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    // Check if user is logged in
    isLoggedIn() {
        return localStorage.getItem('currentUser') !== null;
    }

    // Logout
    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
    }
}

// DOM Manipulation and Event Handlers
document.addEventListener('DOMContentLoaded', () => {
    const authManager = new AuthManager();
    const container = document.querySelector('.container');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginToggle = document.getElementById('loginToggle');
    const registerToggle = document.getElementById('registerToggle');

    // Toggle between login and register
    loginToggle.addEventListener('click', () => {
        container.classList.remove('active');
        loginToggle.classList.add('active');
        registerToggle.classList.remove('active');
    });

    registerToggle.addEventListener('click', () => {
        container.classList.add('active');
        registerToggle.classList.add('active');
        loginToggle.classList.remove('active');
    });

    // Login Form Handler
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;

        const result = authManager.login(email, password);
        
        if (result.success) {
            alert(result.message);
            window.location.href = 'index.html'; // Redirect to main app
        } else {
            alert(result.message);
        }
    });

    // Register Form Handler
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = registerForm.querySelector('input[name="username"]').value;
        const email = registerForm.querySelector('input[type="email"]').value;
        const password = registerForm.querySelector('input[type="password"]').value;

        const result = authManager.register(username, email, password);
        
        if (result.success) {
            alert(result.message);
            // Switch to login form
            container.classList.remove('active');
            loginToggle.classList.add('active');
            registerToggle.classList.remove('active');
        } else {
            alert(result.message);
        }
    });

    // Check if already logged in when accessing authentication page
    if (authManager.isLoggedIn()) {
        window.location.href = 'index.html';
    }
});