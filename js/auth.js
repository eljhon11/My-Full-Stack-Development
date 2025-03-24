document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const navLinks = document.querySelector('.nav-links');
    
    // Find the login link
    const loginLink = Array.from(navLinks.querySelectorAll('li a')).find(link => 
        link.textContent.toLowerCase() === 'login'
    );
    
    if (token) {
        // User is logged in, change login to dashboard/logout
        if (loginLink) {
            const loginLi = loginLink.parentElement;
            loginLi.innerHTML = `
                <a href="#" id="nav-dashboard">Dashboard</a>
            `;
            
            // Create logout link
            const logoutLi = document.createElement('li');
            logoutLi.innerHTML = `<a href="#" id="nav-logout">Logout</a>`;
            navLinks.appendChild(logoutLi);
            
            // Add event listeners
            document.getElementById('nav-dashboard').addEventListener('click', (e) => {
                e.preventDefault();
                // Determine which dashboard to show based on user role
                fetch('/api/auth/user', {
                    headers: {
                        'x-auth-token': token
                    }
                })
                .then(res => res.json())
                .then(user => {
                    if (user.role === 'admin') {
                        window.location.href = 'dashboard.html';
                    } else {
                        window.location.href = 'user-dashboard.html';
                    }
                })
                .catch(err => {
                    console.error('Error fetching user data:', err);
                    localStorage.removeItem('token');
                    window.location.reload();
                });
            });
            
            document.getElementById('nav-logout').addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('token');
                window.location.href = 'index.html';
            });
        }
    }
});