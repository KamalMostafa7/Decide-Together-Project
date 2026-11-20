// Authentication utilities
const auth = {
  getToken() {
    return localStorage.getItem('token');
  },

  setToken(token) {
    localStorage.setItem('token', token);
  },

  removeToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  },

  async fetchWithAuth(url, options = {}) {
    const token = this.getToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (response.status === 401) {
      this.removeToken();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    return response;
  },

  logout() {
    this.removeToken();
    window.location.href = '/login';
  }
};

// Update UI based on authentication status
function updateAuthUI() {
  const isAuth = auth.isAuthenticated();
  const isAdmin = auth.isAdmin();
  const user = auth.getUser();

  const loginNavItem = document.getElementById('loginNavItem');
  const registerNavItem = document.getElementById('registerNavItem');
  const userNavItem = document.getElementById('userNavItem');
  const reportNavItem = document.getElementById('reportNavItem');
  const dashboardNavItem = document.getElementById('dashboardNavItem');
  const profileNavItem = document.getElementById('profileNavItem');
  const notificationsNavItem = document.getElementById('notificationsNavItem');
  const userName = document.getElementById('userName');

  if (loginNavItem) loginNavItem.style.display = isAuth ? 'none' : 'block';
  if (registerNavItem) registerNavItem.style.display = isAuth ? 'none' : 'block';
  if (userNavItem) userNavItem.style.display = isAuth ? 'block' : 'none';
  if (reportNavItem) reportNavItem.style.display = isAuth ? 'block' : 'none';
  if (dashboardNavItem) dashboardNavItem.style.display = isAdmin ? 'block' : 'none';
  if (profileNavItem) profileNavItem.style.display = isAuth ? 'block' : 'none';
  if (notificationsNavItem) notificationsNavItem.style.display = isAuth ? 'block' : 'none';

  if (userName && user) {
    userName.textContent = user.name;
  }
}

// Logout button handler
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      
      // Check if showConfirmDialog is available
      if (typeof showConfirmDialog === 'function') {
        const confirmed = await showConfirmDialog({
          title: 'Logout',
          message: 'Are you sure you want to logout?',
          type: 'warning',
          confirmText: 'Logout',
          cancelText: 'Cancel',
          confirmButtonClass: 'btn-danger'
        });
        
        if (confirmed) {
          auth.logout();
        }
      } else {
        // Fallback to regular logout if confirmDialog not available
        auth.logout();
      }
    });
  }

  updateAuthUI();
});
