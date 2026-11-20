// Report form with location picker
let reportMap;
let reportMarker;
let selectedLat, selectedLng;

document.addEventListener('DOMContentLoaded', () => {
  // Check authentication
  if (!auth.isAuthenticated()) {
    window.location.href = '/login';
    return;
  }

  // Populate governorates dropdown
  populateGovernorates();

  initReportMap();
  
  const reportForm = document.getElementById('reportForm');
  const reportAlert = document.getElementById('reportAlert');
  const governorateSelect = document.getElementById('governorate');

  // Update map center when governorate is selected
  governorateSelect.addEventListener('change', (e) => {
    const governorate = e.target.value;
    if (governorate && typeof getGovernorateCoordinates === 'function') {
      const coords = getGovernorateCoordinates(governorate);
      reportMap.setView(coords, 10);
    }
  });

  reportForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!selectedLat || !selectedLng) {
      showAlert('danger', 'Please select a location on the map');
      return;
    }

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const suggestedSolution = document.getElementById('suggestedSolution').value;
    const category = document.getElementById('category').value;
    const governorate = document.getElementById('governorate').value;
    const city = document.getElementById('city').value;
    const address = document.getElementById('address').value;
    const imageUrl = document.getElementById('imageUrl').value;

    try {
      const response = await auth.fetchWithAuth(config.endpoints.reports.all, {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          suggested_solution: suggestedSolution || null,
          category,
          governorate,
          city: city || null,
          address: address || null,
          latitude: selectedLat,
          longitude: selectedLng,
          image_url: imageUrl || null
        })
      });

      const data = await response.json();

      if (response.ok) {
        await showAlertDialog({
          title: 'Success!',
          message: 'Your report has been submitted successfully! Thank you for helping improve your community.',
          type: 'success',
          buttonText: 'View Reports'
        });
        
        reportForm.reset();
        if (reportMarker) {
          reportMap.removeLayer(reportMarker);
        }
        selectedLat = null;
        selectedLng = null;
        document.getElementById('coordsDisplay').textContent = '';
        
        window.location.href = '/browse.html';
      } else {
        await showAlertDialog({
          title: 'Error',
          message: data.error || 'Failed to submit report. Please try again.',
          type: 'danger',
          buttonText: 'OK'
        });
      }
    } catch (error) {
      await showAlertDialog({
        title: 'Error',
        message: 'Network error. Please check your connection and try again.',
        type: 'danger',
        buttonText: 'OK'
      });
    }
  });

  function showAlert(type, message) {
    reportAlert.className = `alert alert-${type}`;
    reportAlert.textContent = message;
    reportAlert.classList.remove('d-none');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

function populateGovernorates() {
  const governorateSelect = document.getElementById('governorate');
  if (!governorateSelect || typeof getGovernoratesList !== 'function') return;

  const governorates = getGovernoratesList();
  const currentLang = localStorage.getItem('language') || 'en';
  
  governorates.forEach(gov => {
    const option = document.createElement('option');
    option.value = gov;
    option.textContent = getGovernorateName(gov, currentLang);
    governorateSelect.appendChild(option);
  });
}

function initReportMap() {
  // Center on Egypt (Cairo)
  reportMap = L.map('reportMap').setView([30.0444, 31.2357], 6);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
    minZoom: 5
  }).addTo(reportMap);

  // Set max bounds to Egypt area
  const egyptBounds = L.latLngBounds(
    L.latLng(22.0, 25.0),  // Southwest
    L.latLng(32.0, 37.0)   // Northeast
  );
  reportMap.setMaxBounds(egyptBounds);

  // Click to select location
  reportMap.on('click', (e) => {
    selectedLat = e.latlng.lat;
    selectedLng = e.latlng.lng;

    document.getElementById('latitude').value = selectedLat;
    document.getElementById('longitude').value = selectedLng;
    document.getElementById('coordsDisplay').textContent = 
      `${selectedLat.toFixed(4)}, ${selectedLng.toFixed(4)}`;

    // Remove existing marker
    if (reportMarker) {
      reportMap.removeLayer(reportMarker);
    }

    // Add new marker
    reportMarker = L.marker([selectedLat, selectedLng]).addTo(reportMap);
  });
}
