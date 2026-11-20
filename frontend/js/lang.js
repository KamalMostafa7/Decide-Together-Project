// Language data
let currentLanguage = localStorage.getItem('language') || 'en';
let translations = {};

// Load language file
async function loadLanguage(lang) {
  try {
    const response = await fetch(`lang/${lang}.json`);
    translations = await response.json();
    updatePageText();
    updateDirection(lang);
    refreshGovernorateDropdowns(lang);
    currentLanguage = lang;
    localStorage.setItem('language', lang);
  } catch (error) {
    console.error('Failed to load language file:', error);
  }
}

// Update all text elements
function updatePageText() {
  document.querySelectorAll('[data-key]').forEach(element => {
    const key = element.getAttribute('data-key');
    if (translations[key]) {
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = translations[key];
      } else {
        element.textContent = translations[key];
      }
    }
  });
}

// Refresh all governorate dropdowns with current language
function refreshGovernorateDropdowns(lang) {
  // Update all governorate select elements
  const selects = document.querySelectorAll('#browseGovernorateFilter, #governorateFilter, #dashGovernorateFilter, #governorate');
  selects.forEach(select => {
    if (!select || typeof getGovernoratesList !== 'function') return;
    
    const currentValue = select.value;
    const options = select.querySelectorAll('option:not([value=""])');
    
    options.forEach(option => {
      const govKey = option.value;
      option.textContent = getGovernorateName(govKey, lang);
    });
    
    select.value = currentValue;
  });
}

// Update page direction (RTL for Arabic)
function updateDirection(lang) {
  const html = document.documentElement;
  const body = document.body;
  
  if (lang === 'ar') {
    html.setAttribute('dir', 'rtl');
    html.setAttribute('lang', 'ar');
    body.style.textAlign = 'right';
  } else {
    html.setAttribute('dir', 'ltr');
    html.setAttribute('lang', 'en');
    body.style.textAlign = 'left';
  }
}

// Toggle language
function toggleLanguage() {
  const newLang = currentLanguage === 'en' ? 'ar' : 'en';
  loadLanguage(newLang);
  
  const langToggleSpan = document.getElementById('currentLang');
  if (langToggleSpan) {
    langToggleSpan.textContent = newLang === 'en' ? 'AR' : 'EN';
  }
  
  // Trigger reload of dynamic content (reports, filters, etc.)
  // Check if we're on browse page or dashboard and reload reports
  if (typeof loadReports === 'function') {
    loadReports();
  }
  
  // Reload governorate filters
  if (typeof populateGovernorateFilter === 'function') {
    const select = document.getElementById('browseGovernorateFilter') || document.getElementById('dashGovernorateFilter');
    if (select) {
      const selectedValue = select.value;
      select.innerHTML = '<option value="">All Governorates</option>';
      populateGovernorateFilter();
      select.value = selectedValue;
    }
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadLanguage(currentLanguage);
  
  const langToggleBtn = document.getElementById('langToggle');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', toggleLanguage);
    
    const langToggleSpan = document.getElementById('currentLang');
    if (langToggleSpan) {
      langToggleSpan.textContent = currentLanguage === 'en' ? 'AR' : 'EN';
    }
  }
});
