-// Login form handler
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const loginAlert = document.getElementById('loginAlert');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Get selected role
    const selectedRole = document.querySelector('input[name="loginRole"]:checked')?.value || 'user';

    try {
      const response = await fetch(config.endpoints.auth.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Check if the logged-in user's role matches the selected role
        if (data.user.role !== selectedRole) {
          if (selectedRole === 'admin') {
            showAlert('danger', 'This account is not an administrator account. Please select "Citizen" or use an admin account.');
          } else {
            showAlert('danger', 'This is an administrator account. Please select "Administrator" to login.');
          }
          return;
        }

        auth.setToken(data.token);
        auth.setUser(data.user);
        
        showAlert('success', 'Login successful! Redirecting...');
        
        setTimeout(() => {
          if (data.user.role === 'admin') {
            window.location.href = '/dashboard.html';
          } else {
            window.location.href = '/';
          }
        }, 1000);
      } else {
        showAlert('danger', data.error || 'Login failed');
      }
    } catch (error) {
      showAlert('danger', 'Network error. Please try again.');
    }
  });

  function showAlert(type, message) {
    loginAlert.className = `alert alert-${type}`;
    loginAlert.textContent = message;
    loginAlert.classList.remove('d-none');
  }
});
