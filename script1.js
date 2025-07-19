// User data structure
let user = {
    name: "User",
    balance: 9000, // Current balance (UGX)
    totalEarnings: 0,
    referrals: 0,
    investments: [],
    lastEarningUpdate: null
};

// Investment plans data
const investmentPlans = {
    "Starter Plan 10k": { amount: 10000, dailyEarnings: 2000, duration: 60 },
    "Starter Plan 30k": { amount: 30000, dailyEarnings: 5000, duration: 60 },
    "Premium Plan 50k": { amount: 50000, dailyEarnings: 7000, duration: 60 },
    "Premium Plan 75k": { amount: 75000, dailyEarnings: 9000, duration: 60 },
    "Premium Plan 120k": { amount: 120000, dailyEarnings: 20000, duration: 69 },
    "Premium Plan 240k": { amount: 240000, dailyEarnings: 25000, duration: 69 }
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    updateDashboard();
    checkAndUpdateEarnings();
});

// Load user data from localStorage
function loadUserData() {
    const savedUser = localStorage.getItem('investmentUser');
    if (savedUser) {
        user = JSON.parse(savedUser);
    }
}

// Save user data to localStorage
function saveUserData() {
    localStorage.setItem('investmentUser', JSON.stringify(user));
}

// Update dashboard display
function updateDashboard() {
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-balance').textContent = formatCurrency(user.balance);
    document.getElementById('total-earnings').textContent = formatCurrency(user.totalEarnings);
    document.getElementById('referral-count').textContent = user.referrals;
    
    // Update transactions list
    updateTransactionsList();
}

// Format currency
function formatCurrency(amount) {
    return amount.toLocaleString('en-US') + ' UGX';
}

// Check and update earnings daily
function checkAndUpdateEarnings() {
    const today = new Date().toDateString();
    
    // If no investments, return
    if (user.investments.length === 0) return;
    
    // If earnings haven't been updated today
    if (user.lastEarningUpdate !== today) {
        let dailyEarnings = 0;
        
        // Calculate earnings from all active investments
        user.investments.forEach(investment => {
            const investmentDate = new Date(investment.date);
            const daysInvested = Math.floor((new Date() - investmentDate) / (1000 * 60 * 60 * 24));
            
            if (daysInvested < investment.duration) {
                dailyEarnings += investment.dailyEarnings;
            }
        });
        
        if (dailyEarnings > 0) {
            user.balance += dailyEarnings;
            user.totalEarnings += dailyEarnings;
            user.lastEarningUpdate = today;
            
            // Add transaction record
            addTransaction(new Date(), "Earnings", dailyEarnings, "Completed");
            
            saveUserData();
            updateDashboard();
            
            // Show notification
            showNotification(`Daily earnings of ${formatCurrency(dailyEarnings)} added to your account!`);
        }
    }
}

// Add new investment
function addInvestment(planName) {
    const plan = investmentPlans[planName];
    if (!plan) return;
    
    // Check if user has enough balance
    if (user.balance < plan.amount) {
        showNotification("Insufficient balance for this investment");
        return false;
    }
    
    // Deduct investment amount
    user.balance -= plan.amount;
    
    // Add investment record
    user.investments.push({
        planName: planName,
        amount: plan.amount,
        dailyEarnings: plan.dailyEarnings,
        duration: plan.duration,
        date: new Date().toISOString()
    });
    
    // Add transaction record
    addTransaction(new Date(), "Investment", -plan.amount, "Completed");
    
    saveUserData();
    updateDashboard();
    
    showNotification(`Successfully invested in ${planName}! Daily earnings will start tomorrow.`);
    return true;
}

// Add transaction to history
function addTransaction(date, type, amount, status) {
    // In a real app, you would save this to a transactions array
    // For now, we'll just update the display
    updateTransactionsList();
}

// Update transactions list in UI
function updateTransactionsList() {
    const transactionsList = document.getElementById('transactions-list');
    if (!transactionsList) return;
    
    // Clear existing rows
    transactionsList.innerHTML = '';
    
    // Add sample transactions (in a real app, you'd use actual transaction data)
    const sampleTransactions = [
        { date: '2023-06-15', type: 'Deposit', amount: 10000, status: 'Completed' },
        { date: '2023-06-16', type: 'Investment', amount: -10000, status: 'Completed' },
        { date: '2023-06-17', type: 'Earnings', amount: 2000, status: 'Completed' },
        { date: '2023-06-18', type: 'Earnings', amount: 2000, status: 'Completed' }
    ];
    
    sampleTransactions.forEach(tx => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${tx.date}</td>
            <td>${tx.type}</td>
            <td>${formatCurrency(tx.amount)}</td>
            <td><span class="status ${tx.status.toLowerCase()}">${tx.status}</span></td>
        `;
        transactionsList.appendChild(row);
    });
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Copy referral link
function copyReferralLink() {
    const referralInput = document.getElementById('referral-link');
    referralInput.select();
    document.execCommand('copy');
    showNotification('Referral link copied to clipboard!');
}

// Logout function
function logout() {
    localStorage.removeItem('investmentUser');
    window.location.href = 'index.html';
                                             }
