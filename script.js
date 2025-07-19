// User data (in a real app, this would come from backend)
let currentUser = null;

// DOM Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

// Upload areas
const mtnUpload = document.getElementById('mtn-upload');
const airtelUpload = document.getElementById('airtel-upload');
const mtnScreenshot = document.getElementById('mtn-screenshot');
const airtelScreenshot = document.getElementById('airtel-screenshot');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token && window.location.pathname.includes('index.html')) {
        window.location.href = 'dashboard.html';
    } else if (!token && !window.location.pathname.includes('index.html')) {
        window.location.href = 'index.html';
    }

    // Set up file uploads
    if (mtnUpload) {
        mtnUpload.addEventListener('click', () => mtnScreenshot.click());
        mtnScreenshot.addEventListener('change', handleFileUpload);
    }

    if (airtelUpload) {
        airtelUpload.addEventListener('click', () => airtelScreenshot.click());
        airtelScreenshot.addEventListener('change', handleFileUpload);
    }

    // Load user data if on dashboard
    if (window.location.pathname.includes('dashboard.html')) {
        loadUserData();
    }

    // Load balance if on withdraw page
    if (window.location.pathname.includes('withdraw.html')) {
        document.getElementById('user-balance').textContent = '10,000 UGX'; // Replace with actual data
    }
});

// Switch between login and signup tabs
function switchTab(tab) {
    if (tab === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        document.querySelectorAll('.tab')[0].classList.add('active');
        document.querySelectorAll('.tab')[1].classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        document.querySelectorAll('.tab')[0].classList.remove('active');
        document.querySelectorAll('.tab')[1].classList.add('active');
    }
}

// Handle login
function login() {
    const phone = document.getElementById('login-phone').value;
    const password = document.getElementById('login-password').value;

    // Basic validation
    if (!phone || !password) {
        alert('Please enter both phone and password');
        return;
    }

    // In a real app, you would call your backend API here
    // For demo purposes, we'll simulate a successful login
    currentUser = {
        id: 'user123',
        name: 'Active User',
        phone: phone,
        balance: 9000
    };

    // Save token to localStorage
    localStorage.setItem('token', 'demo_token');
    localStorage.setItem('user', JSON.stringify(currentUser));

    // Redirect to dashboard
    window.location.href = 'dashboard.html';
}

// Handle signup
function signup() {
    const name = document.getElementById('signup-name').value;
    const phone = document.getElementById('signup-phone').value;
    const password = document.getElementById('signup-password').value;

    // Basic validation
    if (!name || !phone || !password) {
        alert('Please fill all fields');
        return;
    }

    // In a real app, you would call your backend API here
    // For demo purposes, we'll simulate a successful signup
    alert('Account created successfully! Please login.');
    switchTab('login');
}

// Handle file upload
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const uploadArea = e.target.id.includes('mtn') ? mtnUpload : airtelUpload;

    // Display file name
    uploadArea.innerHTML = `
        <p>${file.name}</p>
        <small>Click to change</small>
    `;

    // In a real app, you would upload the file to your server here
}

// Submit deposit
function submitDeposit(method) {
    const amountInput = method === 'mtn' ? 'mtn-amount' : 'airtel-amount';
    const amount = document.getElementById(amountInput).value;
    const screenshotInput = method === 'mtn' ? mtnScreenshot : airtelScreenshot;

    if (!amount || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    if (!screenshotInput.files[0]) {
        alert('Please upload payment screenshot');
        return;
    }

    // In a real app, you would send this data to your backend
    const depositData = {
        method: method,
        amount: amount,
        screenshot: screenshotInput.files[0].name,
        date: new Date().toLocaleString()
    };

    console.log('Deposit submitted:', depositData);
    alert('Deposit submitted for verification. You will be notified once approved.');

    // Reset form
    document.getElementById(amountInput).value = '';
    if (method === 'mtn') {
        mtnUpload.innerHTML = '<p>Upload Payment Screenshot</p>';
    } else {
        airtelUpload.innerHTML = '<p>Upload Payment Screenshot</p>';
    }
    screenshotInput.value = '';
}

// Submit withdrawal request
function submitWithdrawal() {
    const amount = document.getElementById('withdraw-amount').value;
    const method = document.getElementById('withdraw-method').value;
    const phone = document.getElementById('withdraw-phone').value;

    if (!amount || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    if (!phone) {
        alert('Please enter your phone number');
        return;
    }

    // In a real app, you would check user balance first
    const balance = 2000; // Replace with actual balance check
    if (amount > balance) {
        alert('Insufficient balance');
        return;
    }

    // In a real app, you would send this data to your backend
    const withdrawalData = {
        method: method,
        amount: amount,
        phone: phone,
        date: new Date().toLocaleString()
    };

    console.log('Withdrawal submitted:', withdrawalData);
    
    // This is where you would notify the admin
    notifyAdmin(withdrawalData);

    alert('Withdrawal request submitted. Admin will process it shortly.');
    
    // Reset form
    document.getElementById('withdraw-amount').value = '';
    document.getElementById('withdraw-phone').value = '';
}

// Notify admin about withdrawal (simulated)
function notifyAdmin(withdrawalData) {
    const adminNotification = {
        type: 'withdrawal',
        user: currentUser ? currentUser.phone : 'Unknown',
        amount: withdrawalData.amount,
        method: withdrawalData.method,
        phone: withdrawalData.phone,
        timestamp: new Date().toLocaleString()
    };

    console.log('ADMIN NOTIFICATION:', adminNotification);
    
    // In a real app, this would send an email/SMS to admin
    alert(`Admin has been notified about this withdrawal request for ${withdrawalData.amount} UGX`);
}

// Invest in a plan
function invest(amount, dailyReturn, duration) {
    if (!confirm(`Confirm investment of ${amount} UGX for ${duration} days?`)) {
        return;
    }

    // In a real app, you would call your backend API here
    const investmentData = {
        amount: amount,
        dailyReturn: dailyReturn,
        duration: duration,
        startDate: new Date().toLocaleDateString(),
        endDate: new Date(Date.now() + duration * 24 * 60 * 60 * 2000).toLocaleDateString()
    };

    console.log('Investment made:', investmentData);
    alert(`Successfully invested ${amount} UGX. You will earn ${dailyReturn} UGX daily for ${duration} days.`);
}

// Load user data for dashboard
function loadUserData() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        // Update dashboard with user data
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('user-balance').textContent = `${user.balance.toLocaleString()} UGX`;
    }
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}
