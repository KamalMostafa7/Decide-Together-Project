// Main page initialization
document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
  
  // Populate governorate filter
  populateGovernorateFilterMain();
  
  // Load notifications if authenticated
  if (auth.isAuthenticated()) {
    loadNotifications();
    setInterval(loadNotifications, 30000); // Check every 30 seconds
  }
});

// Populate governorate filter for main page
function populateGovernorateFilterMain() {
  const governorateFilter = document.getElementById('governorateFilter');
  if (!governorateFilter || typeof getGovernoratesList !== 'function') return;

  const governorates = getGovernoratesList();
  const currentLang = localStorage.getItem('language') || 'en';
  
  governorates.forEach(gov => {
    const option = document.createElement('option');
    option.value = gov;
    option.textContent = getGovernorateName(gov, currentLang);
    governorateFilter.appendChild(option);
  });
}

// Load notifications
async function loadNotifications() {
  if (!auth.isAuthenticated()) return;

  try {
    const response = await auth.fetchWithAuth(config.endpoints.notifications.all);
    const data = await response.json();
    const notifications = data.notifications || [];
    
    const unreadCount = notifications.filter(n => !n.is_read).length;
    const badge = document.getElementById('notificationBadge');
    
    if (badge) {
      if (unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.style.display = 'inline';
      } else {
        badge.style.display = 'none';
      }
    }
  } catch (error) {
    console.error('Failed to load notifications:', error);
  }
}
