let map;
let markers = [];
let allReports = [];

// Initialize map
function initMap() {
  // Center on world map
  map = L.map('map').setView([20, 0], 2);

  // Add OpenStreetMap tile layer with noWrap to prevent teleporting
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
    minZoom: 2,
    noWrap: true,  // This prevents the teleporting wrap-around effect
    bounds: [[-90, -180], [90, 180]]
  }).addTo(map);

  // Add legend
  addMapLegend();

  // Load reports
  loadReports();
}

// Add legend to map
function addMapLegend() {
  const legend = L.control({ position: 'bottomright' });

  legend.onAdd = function() {
    const div = L.DomUtil.create('div', 'map-legend');
    div.innerHTML = `
      <h6><i class="fas fa-info-circle"></i> Legend</h6>
      <div style="margin-bottom: 12px;">
        <small style="font-weight: bold; color: #666;">Status</small>
        <div class="legend-item">
          <span class="legend-icon" style="background: linear-gradient(135deg, #dc3545 0%, #dc3545dd 100%);"></span>
          <span>Open</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon" style="background: linear-gradient(135deg, #fd7e14 0%, #fd7e14dd 100%);"></span>
          <span>In Progress</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon" style="background: linear-gradient(135deg, #28a745 0%, #28a745dd 100%);"></span>
          <span>Resolved</span>
        </div>
      </div>
      <div>
        <small style="font-weight: bold; color: #666;">Category Icons</small>
        <div class="legend-item">
          <i class="fas fa-road" style="width: 20px; color: #0d6efd;"></i>
          <span style="font-size: 12px;">Infrastructure</span>
        </div>
        <div class="legend-item">
          <i class="fas fa-trash" style="width: 20px; color: #0d6efd;"></i>
          <span style="font-size: 12px;">Cleanliness</span>
        </div>
        <div class="legend-item">
          <i class="fas fa-shield-alt" style="width: 20px; color: #0d6efd;"></i>
          <span style="font-size: 12px;">Safety</span>
        </div>
        <div class="legend-item">
          <i class="fas fa-lightbulb" style="width: 20px; color: #0d6efd;"></i>
          <span style="font-size: 12px;">Utilities</span>
        </div>
        <div class="legend-item">
          <i class="fas fa-flag" style="width: 20px; color: #0d6efd;"></i>
          <span style="font-size: 12px;">Other</span>
        </div>
      </div>
    `;
    return div;
  };

  legend.addTo(map);
}

// Load reports with filters
async function loadReports() {
  try {
    const governorateFilter = document.getElementById('governorateFilter')?.value || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    
    let url = config.endpoints.reports.all;
    const params = new URLSearchParams();
    
    if (governorateFilter) params.append('governorate', governorateFilter);
    if (categoryFilter) params.append('category', categoryFilter);
    if (statusFilter) params.append('status', statusFilter);
    
    if (params.toString()) {
      url += '?' + params.toString();
    }

    const response = await fetch(url);
    const data = await response.json();
    
    allReports = data.reports || [];
    displayReportsOnMap(allReports);
    displayReportsList(allReports);
    updateStats(allReports);
  } catch (error) {
    console.error('Failed to load reports:', error);
  }
}

// Display reports on map
function displayReportsOnMap(reports) {
  // Clear existing markers
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  reports.forEach(report => {
    // Get color based on status with vibrant colors
    const statusColor = {
      'open': '#dc3545',        // Vibrant red
      'in_progress': '#fd7e14', // Vibrant orange
      'resolved': '#28a745'     // Vibrant green
    }[report.status] || '#6c757d';

    // Get icon based on category
    const categoryIcon = {
      'infrastructure': 'fa-road',
      'cleanliness': 'fa-trash',
      'safety': 'fa-shield-alt',
      'utilities': 'fa-lightbulb',
      'other': 'fa-flag'
    }[report.category] || 'fa-flag';

    // Create custom colored icon with pulsing animation
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background: linear-gradient(135deg, ${statusColor} 0%, ${statusColor}dd 100%);
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 8px rgba(0,0,0,0.4), 0 0 0 0 ${statusColor}88;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: pulse 2s infinite;
      ">
        <i class="fas ${categoryIcon}" style="
          color: white;
          font-size: 13px;
          transform: rotate(45deg);
          margin-top: -3px;
          margin-left: 2px;
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
        "></i>
      </div>
      <style>
        @keyframes pulse {
          0% {
            box-shadow: 0 4px 8px rgba(0,0,0,0.4), 0 0 0 0 ${statusColor}88;
          }
          50% {
            box-shadow: 0 4px 8px rgba(0,0,0,0.4), 0 0 0 8px ${statusColor}00;
          }
          100% {
            box-shadow: 0 4px 8px rgba(0,0,0,0.4), 0 0 0 0 ${statusColor}00;
          }
        }
      </style>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    // Create marker with custom icon
    const marker = L.marker([report.latitude, report.longitude], { icon: customIcon }).addTo(map);

    // Create popup content
    const statusBadge = report.status === 'open' ? 'danger' : 
                       report.status === 'in_progress' ? 'warning' : 'success';
    
    const popupContent = `
      <div style="min-width: 200px;">
        <h6><strong>${report.title}</strong></h6>
        <p><small>${report.description.substring(0, 100)}...</small></p>
        <p>
          <span class="badge bg-${statusBadge}">${report.status.replace('_', ' ').toUpperCase()}</span>
          <span class="badge bg-info">${report.category}</span>
        </p>
        <p>
          <i class="fas fa-thumbs-up"></i> ${report.upvotes || 0}
          <i class="fas fa-thumbs-down ms-2"></i> ${report.downvotes || 0}
          <i class="fas fa-comment ms-2"></i> ${report.commentCount || 0}
        </p>
        <button class="btn btn-sm btn-primary" onclick="viewReportDetails(${report.id})">
          View Details
        </button>
      </div>
    `;

    marker.bindPopup(popupContent);

    markers.push(marker);
  });
}

// Display reports list
function displayReportsList(reports) {
  const reportsList = document.getElementById('reportsList');
  if (!reportsList) return;

  if (reports.length === 0) {
    reportsList.innerHTML = '<p class="text-center text-muted">No reports found</p>';
    return;
  }

  reportsList.innerHTML = reports.slice(0, 10).map(report => `
    <div class="card mb-3">
      <div class="card-body">
        <div class="row">
          <div class="col-md-8">
            <h5>${report.title}</h5>
            <p class="text-muted">${report.description.substring(0, 150)}...</p>
            <div>
              <span class="badge bg-${
                report.status === 'open' ? 'danger' : 
                report.status === 'in_progress' ? 'warning' : 'success'
              }">
                ${report.status.replace('_', ' ').toUpperCase()}
              </span>
              <span class="badge bg-info">${report.category}</span>
              <small class="text-muted ms-2">
                by ${report.user?.name || 'Unknown'} • 
                ${new Date(report.createdAt).toLocaleDateString()}
              </small>
            </div>
          </div>
          <div class="col-md-4 text-end">
            <div class="mb-2">
              <i class="fas fa-thumbs-up text-success"></i> ${report.upvotes || 0}
              <i class="fas fa-thumbs-down text-danger ms-2"></i> ${report.downvotes || 0}
              <i class="fas fa-comment text-primary ms-2"></i> ${report.commentCount || 0}
            </div>
            <button class="btn btn-sm btn-primary" onclick="viewReportDetails(${report.id})">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// Update statistics
function updateStats(reports) {
  const total = reports.length;
  const open = reports.filter(r => r.status === 'open').length;
  const inProgress = reports.filter(r => r.status === 'in_progress').length;
  const resolved = reports.filter(r => r.status === 'resolved').length;

  document.getElementById('totalReports').textContent = total;
  document.getElementById('openReports').textContent = open;
  document.getElementById('inProgressReports').textContent = inProgress;
  document.getElementById('resolvedReports').textContent = resolved;
}

// View report details
async function viewReportDetails(reportId) {
  try {
    const response = await fetch(config.endpoints.reports.byId(reportId));
    const data = await response.json();
    const report = data.report;

    const modalTitle = document.getElementById('reportModalTitle');
    const modalBody = document.getElementById('reportModalBody');

    modalTitle.textContent = report.title;
    modalBody.innerHTML = `
      <div class="mb-3">
        ${report.image_url ? `<img src="${report.image_url}" class="img-fluid mb-3" alt="Report image">` : ''}
        <p><strong>Description:</strong> ${report.description}</p>
        ${report.suggested_solution ? `<p><strong>Suggested Solution:</strong> <span class="text-muted">${report.suggested_solution}</span></p>` : ''}
        <p>
          <span class="badge bg-${
            report.status === 'open' ? 'danger' : 
            report.status === 'in_progress' ? 'warning' : 'success'
          }">
            ${report.status.replace('_', ' ').toUpperCase()}
          </span>
          <span class="badge bg-info">${report.category}</span>
        </p>
        <p><strong>Reported by:</strong> ${report.user?.name || 'Unknown'}</p>
        <p><strong>Date:</strong> ${new Date(report.createdAt).toLocaleString()}</p>
        <p><strong>Location:</strong> ${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)}</p>
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold">
          <i class="fas fa-link"></i> <span data-key="report_url">Report URL</span>
        </label>
        <div class="input-group">
          <input type="text" class="form-control" id="mapReportUrlInput" value="${window.location.origin}/browse.html?id=${report.id}" readonly>
          <button class="btn btn-outline-primary" type="button" onclick="copyMapReportUrl()">
            <i class="fas fa-copy"></i> <span data-key="copy_url">Copy</span>
          </button>
        </div>
        <small class="text-muted" data-key="share_report_help">Share this link to let others view this report</small>
      </div>

      <div class="mb-3">
        <h6>Votes</h6>
        <button class="btn btn-success btn-sm" onclick="vote(${report.id}, 'upvote')">
          <i class="fas fa-thumbs-up"></i> ${report.upvotes || 0}
        </button>
        <button class="btn btn-danger btn-sm ms-2" onclick="vote(${report.id}, 'downvote')">
          <i class="fas fa-thumbs-down"></i> ${report.downvotes || 0}
        </button>
      </div>

      <div class="mb-3">
        <h6>Comments (${report.comments?.length || 0})</h6>
        <div id="commentsList">
          ${report.comments && report.comments.length > 0 ? 
            report.comments.map(comment => `
              <div class="card mb-2">
                <div class="card-body p-2">
                  <small><strong>${comment.user?.name || 'User'}</strong></small><br>
                  <small>${comment.content}</small><br>
                  <small class="text-muted">${new Date(comment.createdAt).toLocaleString()}</small>
                </div>
              </div>
            `).join('') : 
            '<p class="text-muted">No comments yet</p>'
          }
        </div>
        ${auth.isAuthenticated() ? `
          <div class="mt-3">
            <textarea class="form-control mb-2" id="commentInput" placeholder="Add a comment..." rows="2"></textarea>
            <button class="btn btn-primary btn-sm" onclick="addComment(${report.id})">Add Comment</button>
          </div>
        ` : '<p class="text-muted">Login to add comments</p>'}
      </div>

      ${(() => {
        if (auth.isAuthenticated()) {
          const currentUser = auth.getUser();
          const isAdmin = auth.isAdmin();
          if (currentUser && (currentUser.id === report.user_id || isAdmin)) {
            return `
              <div class="mt-3">
                <button class="btn btn-danger btn-sm" onclick="deleteReportFromMap(${report.id})">
                  <i class="fas fa-trash"></i> Delete Report
                </button>
              </div>
            `;
          }
        }
        return '';
      })()}
    `;

    const modal = new bootstrap.Modal(document.getElementById('reportModal'));
    modal.show();
  } catch (error) {
    console.error('Failed to load report details:', error);
    alert('Failed to load report details');
  }
}

// Vote on report
async function vote(reportId, voteType) {
  if (!auth.isAuthenticated()) {
    alert('Please login to vote');
    window.location.href = '/login';
    return;
  }

  try {
    const response = await auth.fetchWithAuth(config.endpoints.votes.create, {
      method: 'POST',
      body: JSON.stringify({ report_id: reportId, vote_type: voteType })
    });

    if (response.ok) {
      viewReportDetails(reportId);
      loadReports();
    }
  } catch (error) {
    console.error('Failed to vote:', error);
  }
}

// Add comment
async function addComment(reportId) {
  const commentInput = document.getElementById('commentInput');
  const content = commentInput.value.trim();

  if (!content) {
    alert('Please enter a comment');
    return;
  }

  try {
    const response = await auth.fetchWithAuth(config.endpoints.comments.create, {
      method: 'POST',
      body: JSON.stringify({ report_id: reportId, content })
    });

    if (response.ok) {
      commentInput.value = '';
      viewReportDetails(reportId);
    }
  } catch (error) {
    console.error('Failed to add comment:', error);
  }
}

// Delete report from map
async function deleteReportFromMap(reportId) {
  const confirmed = await showConfirmDialog({
    title: 'Delete Report',
    message: 'Are you sure you want to delete this report? This action cannot be undone and all associated comments and votes will be permanently removed.',
    type: 'danger',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    confirmButtonClass: 'btn-danger'
  });
  
  if (!confirmed) return;

  try {
    const response = await auth.fetchWithAuth(config.endpoints.reports.delete(reportId), {
      method: 'DELETE'
    });

    if (response.ok) {
      await showAlertDialog({
        title: 'Success!',
        message: 'Report has been deleted successfully.',
        type: 'success',
        buttonText: 'OK'
      });
      
      // Close modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('reportModal'));
      if (modal) modal.hide();
      
      // Reload reports
      await loadReports();
    } else {
      const errorData = await response.json();
      await showAlertDialog({
        title: 'Error',
        message: errorData.error || 'Failed to delete report. Please try again.',
        type: 'danger',
        buttonText: 'OK'
      });
    }
  } catch (error) {
    console.error('Failed to delete report:', error);
    await showAlertDialog({
      title: 'Error',
      message: 'Failed to delete report. Please check your connection and try again.',
      type: 'danger',
      buttonText: 'OK'
    });
  }
}

// Copy report URL to clipboard from map page
function copyMapReportUrl() {
  const urlInput = document.getElementById('mapReportUrlInput');
  urlInput.select();
  urlInput.setSelectionRange(0, 99999); // For mobile devices
  
  navigator.clipboard.writeText(urlInput.value).then(() => {
    // Find the button that was clicked
    const buttons = document.querySelectorAll('button[onclick="copyMapReportUrl()"]');
    if (buttons.length > 0) {
      const btn = buttons[0];
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
      btn.classList.remove('btn-outline-primary');
      btn.classList.add('btn-success');
      
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove('btn-success');
        btn.classList.add('btn-outline-primary');
      }, 2000);
    }
  }).catch(err => {
    console.error('Failed to copy URL:', err);
    alert('Failed to copy URL. Please copy manually.');
  });
}
// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('map')) {
    initMap();

    // Filter button
    const applyFiltersBtn = document.getElementById('applyFilters');
    if (applyFiltersBtn) {
      applyFiltersBtn.addEventListener('click', loadReports);
    }
  }
});
