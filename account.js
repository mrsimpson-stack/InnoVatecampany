document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const userEmail = document.getElementById('user-email');
    const userPhone = document.getElementById('user-phone');
    const accountStatus = document.getElementById('account-status');
    const totalInvested = document.getElementById('total-invested');
    const activeInvestments = document.getElementById('active-investments');
    const totalEarnings = document.getElementById('total-earnings');
    const investmentsList = document.getElementById('investments-list');
    const editInfoBtn = document.getElementById('edit-info-btn');
    const editModal = document.getElementById('edit-modal');
    const closeModal = document.querySelector('.close-modal');
    const editForm = document.getElementById('edit-form');
    const editEmail = document.getElementById('edit-email');
    const editPhone = document.getElementById('edit-phone');

    // Load user data
    loadUserData();
    loadInvestments();

    // Modal functionality
    editInfoBtn.addEventListener('click', function() {
        // Pre-fill the form with current data
        editEmail.value = userEmail.textContent;
        editPhone.value = userPhone.textContent;
        editModal.style.display = 'block';
    });

    closeModal.addEventListener('click', function() {
        editModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === editModal) {
            editModal.style.display = 'none';
        }
    });

    // Form submission
    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        updateUserInfo();
    });

    // Function to load user data
    async function loadUserData() {
        try {
            // In a real app, you would fetch this from your API
            // const response = await fetch('/api/user');
            // const userData = await response.json();
            
            // Mock data - replace with actual API call
            const userData = {
                email: "user@example.com",
                phone: "+256 712 345 678",
                status: "active",
                totalInvested: 1500000,
                activeInvestments: 2,
                totalEarnings: 450000
            };

            // Update the DOM
            userEmail.textContent = userData.email;
            userPhone.textContent = userData.phone;
            accountStatus.textContent = userData.status.charAt(0).toUpperCase() + userData.status.slice(1);
            totalInvested.textContent = userData.totalInvested.toLocaleString() + " UGX";
            activeInvestments.textContent = userData.activeInvestments;
            totalEarnings.textContent = userData.totalEarnings.toLocaleString() + " UGX";

        } catch (error) {
            console.error('Error loading user data:', error);
            userEmail.textContent = "Error loading data";
            userPhone.textContent = "Error loading data";
        }
    }

    // Function to load investments
    async function loadInvestments() {
        try {
            // In a real app, you would fetch this from your API
            // const response = await fetch('/api/user/investments');
            // const investments = await response.json();
            
            // Mock data - replace with actual API call
            const investments = [
                {
                    plan: "Premium Plan",
                    amount: 1000000,
                    startDate: "2025-06-15",
                    endDate: "2025-07-15",
                    status: "active",
                    estimatedReturn: 1200000
                },
                {
                    plan: "Starter Plan",
                    amount: 500000,
                    startDate: "2025-07-01",
                    endDate: "2025-08-30",
                    status: "active",
                    estimatedReturn: 600000
                }
            ];

            // Clear existing rows
            investmentsList.innerHTML = '';

            // Add new rows
            investments.forEach(investment => {
                const row = document.createElement('tr');
                
                const statusClass = investment.status === 'active' ? 'status-active' : 
                                  investment.status === 'completed' ? 'status-completed' : 'status-pending';
                
                row.innerHTML = `
                    <td>${investment.plan}</td>
                    <td>${investment.amount.toLocaleString()} UGX</td>
                    <td>${formatDate(investment.startDate)}</td>
                    <td>${formatDate(investment.endDate)}</td>
                    <td><span class="${statusClass}">${capitalizeFirstLetter(investment.status)}</span></td>
                    <td>${investment.estimatedReturn.toLocaleString()} UGX</td>
                `;
                
                investmentsList.appendChild(row);
            });

        } catch (error) {
            console.error('Error loading investments:', error);
            investmentsList.innerHTML = '<tr><td colspan="6">Error loading investments</td></tr>';
        }
    }

    // Function to update user info
    async function updateUserInfo() {
        const newEmail = editEmail.value;
        const newPhone = editPhone.value;
        const currentPassword = document.getElementById('current-password').value;

        try {
            // In a real app, you would send this to your API
            // const response = await fetch('/api/user/update', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         email: newEmail,
            //         phone: newPhone,
            //         currentPassword
            //     })
            // });
            
            // Mock success - replace with actual API response handling
            userEmail.textContent = newEmail;
            userPhone.textContent = newPhone;
            
            alert('Information updated successfully!');
            editModal.style.display = 'none';
            editForm.reset();

        } catch (error) {
            console.error('Error updating user info:', error);
            alert('Failed to update information. Please try again.');
        }
    }

    // Helper functions
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});