// Load Dashboard Data
function loadDashboardData() {
    // Get user from localStorage (simulated)
    const user = JSON.parse(localStorage.getItem('user')) || {
        name: "John Doe",
        balance: 100000,
        earnings: 50000,
        referrals: 3
    };

    // Update user info
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-balance').textContent = user.balance.toLocaleString() + " UGX";
    document.getElementById('total-earnings').textContent = user.earnings.toLocaleString() + " UGX";
    document.getElementById('referral-count').textContent = user.referrals;

    // Load transactions (simulated)
    const transactions = [
        { date: "2023-10-01", type: "Deposit", amount: 50000, status: "completed" },
        { date: "2023-10-05", type: "Investment", amount: 10000, status: "completed" },
        { date: "2023-10-10", type: "Withdrawal", amount: 20000, status: "pending" }
    ];

    const transactionsList = document.getElementById('transactions-list');
    transactionsList.innerHTML = transactions.map(tx => `
        <tr>
            <td>${tx.date}</td>
            <td>${tx.type}</td>
            <td>${tx.amount.toLocaleString()} UGX</td>
            <td class="status-${tx.status}">${tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}</td>
        </tr>
    `).join('');
}

// Copy Referral Link
function copyReferralLink() {
    const linkInput = document.getElementById('referral-link');
    linkInput.select();
    document.execCommand('copy');
    alert("Referral link copied!");
}

// Logout
function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

// Initialize dashboard when page loads
if (window.location.pathname.includes('dashboard.html')) {
    loadDashboardData();
}