// Register form handler
document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const registerAlert = document.getElementById('registerAlert');

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
      showAlert('danger', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      showAlert('danger', 'Password must be at least 6 characters');
      return;
    }

    try {
      const response = await fetch(config.endpoints.auth.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        auth.setToken(data.token);
        auth.setUser(data.user);
        
        showAlert('success', 'Registration successful! Redirecting...');
        
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        showAlert('danger', data.error || 'Registration failed');
      }
    } catch (error) {
      showAlert('danger', 'Network error. Please try again.');
    }
  });

  function showAlert(type, message) {
    registerAlert.className = `alert alert-${type}`;
    registerAlert.textContent = message;
    registerAlert.classList.remove('d-none');
  }
});
