// Dashboard for admin
let statusChart, categoryChart;

document.addEventListener('DOMContentLoaded', () => {
  // Check if user is admin
  if (!auth.isAuthenticated() || !auth.isAdmin()) {
    alert('Access denied. Admin only.');
    window.location.href = '/';
    return;
  }

  // Set user name in navbar
  const user = auth.getUser();
  const userNameElement = document.getElementById('userName');
  if (userNameElement && user) {
    userNameElement.textContent = user.name;
  }

  // Update current date/time
  updateDateTime();
  setInterval(updateDateTime, 1000);

  // Populate governorate filter
  populateGovernorateFilter();

  loadDashboardData();
  initCharts();

  // Filter buttons
  const applyFiltersBtn = document.getElementById('dashApplyFilters');
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', loadReports);
  }

  // Update status form
  const updateStatusForm = document.getElementById('updateStatusForm');
  if (updateStatusForm) {
    updateStatusForm.addEventListener('submit', handleStatusUpdate);
  }
});

function populateGovernorateFilter() {
  const governorateFilter = document.getElementById('dashGovernorateFilter');
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

function getStatusText(status) {
  const currentLang = localStorage.getItem('language') || 'en';
  const key = `status_${status}`;
  
  if (currentLang === 'ar' && window.translations && window.translations.ar && window.translations.ar[key]) {
    return window.translations.ar[key];
  } else if (window.translations && window.translations.en && window.translations.en[key]) {
    return window.translations.en[key];
  }
  
  // Fallback to English text
  const texts = {
    'open': 'Open',
    'in_progress': 'In Progress',
    'resolved': 'Resolved'
  };
  return texts[status] || status;
}

function getCategoryText(category) {
  const currentLang = localStorage.getItem('language') || 'en';
  const key = `category_${category}`;
  
  if (currentLang === 'ar' && window.translations && window.translations.ar && window.translations.ar[key]) {
    return window.translations.ar[key];
  } else if (window.translations && window.translations.en && window.translations.en[key]) {
    return window.translations.en[key];
  }
  
  // Fallback to capitalized category
  return category.charAt(0).toUpperCase() + category.slice(1);
}

async function loadDashboardData() {
  await loadStats();
  await loadReports();
}

async function loadStats() {
  try {
    // Show loading state
    document.getElementById('dashTotalReports').innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
    document.getElementById('dashOpenReports').innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
    document.getElementById('dashInProgressReports').innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
    document.getElementById('dashResolvedReports').innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
    
    const response = await auth.fetchWithAuth(config.endpoints.reports.stats);
    const data = await response.json();
    const stats = data.stats;

    // Animate the numbers counting up
    animateValue('dashTotalReports', 0, stats.total || 0, 800);
    animateValue('dashOpenReports', 0, stats.open || 0, 800);
    animateValue('dashInProgressReports', 0, stats.in_progress || 0, 800);
    animateValue('dashResolvedReports', 0, stats.resolved || 0, 800);

    updateCharts(stats);
  } catch (error) {
    console.error('Failed to load stats:', error);
    document.getElementById('dashTotalReports').textContent = '0';
    document.getElementById('dashOpenReports').textContent = '0';
    document.getElementById('dashInProgressReports').textContent = '0';
    document.getElementById('dashResolvedReports').textContent = '0';
  }
}

// Animate counter from start to end value
function animateValue(elementId, start, end, duration) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const range = end - start;
  const increment = range / (duration / 16); // 60fps
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      current = end;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current);
  }, 16);
}

// Update current date and time
function updateDateTime() {
  const dateTimeElement = document.getElementById('currentDateTime');
  if (!dateTimeElement) return;
  
  const now = new Date();
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  
  dateTimeElement.textContent = now.toLocaleString('en-US', options);
}

async function loadReports() {
  const tableBody = document.getElementById('dashReportsTable');
  
  // Show loading spinner
  tableBody.innerHTML = '<tr><td colspan="8" class="text-center"><div class="spinner-border text-primary"></div></td></tr>';
  
  try {
    const governorateFilter = document.getElementById('dashGovernorateFilter')?.value || '';
    const categoryFilter = document.getElementById('dashCategoryFilter')?.value || '';
    const statusFilter = document.getElementById('dashStatusFilter')?.value || '';
    
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
    const reports = data.reports || [];

    displayReportsTable(reports);
  } catch (error) {
    console.error('Failed to load reports:', error);
    tableBody.innerHTML = '<tr><td colspan="8" class="text-center text-danger">Failed to load reports</td></tr>';
  }
}

function displayReportsTable(reports) {
  const tableBody = document.getElementById('dashReportsTable');
  
  if (reports.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="8" class="text-center">No reports found</td></tr>';
    return;
  }

  tableBody.innerHTML = reports.map(report => {
    const categoryIcons = {
      'infrastructure': 'fa-road',
      'cleanliness': 'fa-broom',
      'safety': 'fa-shield-alt',
      'utilities': 'fa-lightbulb',
      'other': 'fa-ellipsis-h'
    };
    
    const categoryIcon = categoryIcons[report.category] || 'fa-tag';
    
    return `
    <tr onclick="viewReportDetailsAdmin(${report.id})" style="cursor: pointer;">
      <td><strong>#${report.id}</strong></td>
      <td>
        <div class="d-flex align-items-center">
          <i class="fas fa-file-alt text-primary me-2"></i>
          <span>${report.title}</span>
        </div>
      </td>
      <td>
        <span class="badge bg-secondary">
          <i class="fas fa-map-marker-alt"></i> ${report.governorate || 'N/A'}
        </span>
      </td>
      <td>
        <span class="badge bg-info">
          <i class="fas ${categoryIcon}"></i> ${getCategoryText(report.category)}
        </span>
      </td>
      <td>
        <span class="badge bg-${
          report.status === 'open' ? 'danger' : 
          report.status === 'in_progress' ? 'warning text-dark' : 'success'
        }">
          <i class="fas ${
            report.status === 'open' ? 'fa-circle' : 
            report.status === 'in_progress' ? 'fa-spinner' : 'fa-check-circle'
          }"></i>
          ${getStatusText(report.status)}
        </span>
      </td>
      <td>
        <i class="fas fa-calendar-alt text-muted me-1"></i>
        ${new Date(report.createdAt).toLocaleDateString()}
      </td>
      <td>
        <div class="d-flex gap-2 align-items-center">
          <span class="badge bg-success">
            <i class="fas fa-thumbs-up"></i> ${report.upvotes || 0}
          </span>
          <span class="badge bg-danger">
            <i class="fas fa-thumbs-down"></i> ${report.downvotes || 0}
          </span>
        </div>
      </td>
      <td onclick="event.stopPropagation()">
        <div class="btn-group-actions">
          <button class="btn btn-sm btn-info" onclick="viewReportDetailsAdmin(${report.id})" title="View Details">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn btn-sm btn-primary" onclick="openUpdateStatusModal(${report.id}, '${report.status}')" title="Update Status">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="deleteReport(${report.id})" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `;
  }).join('');
}

function initCharts() {
  const statusCtx = document.getElementById('statusChart');
  const categoryCtx = document.getElementById('categoryChart');

  if (statusCtx) {
    statusChart = new Chart(statusCtx, {
      type: 'doughnut',
      data: {
        labels: ['Open', 'In Progress', 'Resolved'],
        datasets: [{
          data: [0, 0, 0],
          backgroundColor: ['#dc3545', '#ffc107', '#28a745']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  if (categoryCtx) {
    categoryChart = new Chart(categoryCtx, {
      type: 'bar',
      data: {
        labels: ['Infrastructure', 'Cleanliness', 'Safety', 'Utilities', 'Other'],
        datasets: [{
          label: 'Reports',
          data: [0, 0, 0, 0, 0],
          backgroundColor: '#0d6efd'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }
}

function updateCharts(stats) {
  if (statusChart) {
    statusChart.data.datasets[0].data = [
      stats.open || 0,
      stats.in_progress || 0,
      stats.resolved || 0
    ];
    statusChart.update();
  }

  if (categoryChart && stats.byCategory) {
    const categoryData = {
      infrastructure: 0,
      cleanliness: 0,
      safety: 0,
      utilities: 0,
      other: 0
    };

    stats.byCategory.forEach(item => {
      categoryData[item.category] = item.count;
    });

    categoryChart.data.datasets[0].data = [
      categoryData.infrastructure,
      categoryData.cleanliness,
      categoryData.safety,
      categoryData.utilities,
      categoryData.other
    ];
    categoryChart.update();
  }
}

function openUpdateStatusModal(reportId, currentStatus) {
  document.getElementById('updateReportId').value = reportId;
  document.getElementById('newStatus').value = currentStatus;
  
  const modal = new bootstrap.Modal(document.getElementById('updateStatusModal'));
  modal.show();
}

async function handleStatusUpdate(e) {
  e.preventDefault();
  
  const reportId = document.getElementById('updateReportId').value;
  const newStatus = document.getElementById('newStatus').value;

  try {
    const response = await auth.fetchWithAuth(
      config.endpoints.reports.updateStatus(reportId),
      {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      }
    );

    if (response.ok) {
      const modal = bootstrap.Modal.getInstance(document.getElementById('updateStatusModal'));
      modal.hide();
      
      await loadDashboardData();
      
      await showAlertDialog({
        title: 'Success!',
        message: 'Report status has been updated successfully.',
        type: 'success',
        buttonText: 'OK'
      });
    } else {
      const data = await response.json();
      await showAlertDialog({
        title: 'Error',
        message: data.error || 'Failed to update status. Please try again.',
        type: 'danger',
        buttonText: 'OK'
      });
    }
  } catch (error) {
    console.error('Failed to update status:', error);
    await showAlertDialog({
      title: 'Error',
      message: 'Failed to update status. Please check your connection and try again.',
      type: 'danger',
      buttonText: 'OK'
    });
  }
}

async function deleteReport(reportId) {
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
    const response = await auth.fetchWithAuth(
      config.endpoints.reports.delete(reportId),
      { method: 'DELETE' }
    );

    if (response.ok) {
      await loadDashboardData();
      await showAlertDialog({
        title: 'Success!',
        message: 'Report has been deleted successfully.',
        type: 'success',
        buttonText: 'OK'
      });
    } else {
      const data = await response.json();
      await showAlertDialog({
        title: 'Error',
        message: data.error || 'Failed to delete report. Please try again.',
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

// View report details in modal
async function viewReportDetailsAdmin(reportId) {
  try {
    const response = await auth.fetchWithAuth(config.endpoints.reports.byId(reportId));
    const data = await response.json();
    const report = data.report;

    // Create modal content
    const modalContent = `
      <div class="modal fade" id="reportDetailsModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="fas fa-flag"></i> Report #${report.id} - ${report.title}
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              ${report.image_url ? `<img src="${report.image_url}" class="img-fluid mb-3 rounded" alt="Report image">` : ''}
              
              <div class="row mb-3">
                <div class="col-md-6">
                  <strong><i class="fas fa-user"></i> Reported by:</strong><br>
                  ${report.user?.name || 'Unknown'} (${report.user?.email || 'N/A'})
                </div>
                <div class="col-md-6">
                  <strong><i class="fas fa-calendar"></i> Date:</strong><br>
                  ${new Date(report.createdAt).toLocaleString()}
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-4">
                  <strong><i class="fas fa-map-marker-alt"></i> Governorate:</strong><br>
                  <span class="badge bg-secondary">${report.governorate}</span>
                </div>
                <div class="col-md-4">
                  <strong><i class="fas fa-tag"></i> Category:</strong><br>
                  <span class="badge bg-info">${getCategoryText(report.category)}</span>
                </div>
                <div class="col-md-4">
                  <strong><i class="fas fa-traffic-light"></i> Status:</strong><br>
                  <span class="badge bg-${
                    report.status === 'open' ? 'danger' : 
                    report.status === 'in_progress' ? 'warning' : 'success'
                  }">
                    ${getStatusText(report.status)}
                  </span>
                </div>
              </div>

              ${report.city ? `
              <div class="mb-3">
                <strong><i class="fas fa-city"></i> City/District:</strong><br>
                ${report.city}
              </div>
              ` : ''}

              ${report.address ? `
              <div class="mb-3">
                <strong><i class="fas fa-map-pin"></i> Address:</strong><br>
                ${report.address}
              </div>
              ` : ''}

              <div class="mb-3">
                <strong><i class="fas fa-info-circle"></i> Description:</strong><br>
                <p class="mt-2">${report.description}</p>
              </div>

              ${report.suggested_solution ? `
              <div class="mb-3">
                <strong><i class="fas fa-lightbulb"></i> Suggested Solution:</strong><br>
                <p class="text-muted mt-2">${report.suggested_solution}</p>
              </div>
              ` : ''}

              <div class="mb-3">
                <strong><i class="fas fa-map"></i> Location:</strong><br>
                Coordinates: ${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)}
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <strong><i class="fas fa-thumbs-up text-success"></i> Upvotes:</strong> ${report.upvotes || 0}
                </div>
                <div class="col-md-6">
                  <strong><i class="fas fa-thumbs-down text-danger"></i> Downvotes:</strong> ${report.downvotes || 0}
                </div>
              </div>

              <hr>

              <div class="mb-3">
                <h6><i class="fas fa-comments"></i> Comments (${report.comments?.length || 0})</h6>
                <div class="mt-2">
                  ${report.comments && report.comments.length > 0 ? 
                    report.comments.map(comment => `
                      <div class="card mb-2">
                        <div class="card-body p-3">
                          <div class="d-flex justify-content-between align-items-start">
                            <div>
                              <strong>${comment.user?.name || 'User'}</strong>
                              <small class="text-muted"> • ${new Date(comment.createdAt).toLocaleString()}</small>
                            </div>
                          </div>
                          <p class="mb-0 mt-2">${comment.content}</p>
                        </div>
                      </div>
                    `).join('') : 
                    '<p class="text-muted">No comments yet</p>'
                  }
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" onclick="openUpdateStatusModal(${report.id}, '${report.status}'); bootstrap.Modal.getInstance(document.getElementById('reportDetailsModal')).hide();">
                <i class="fas fa-edit"></i> Update Status
              </button>
              <button type="button" class="btn btn-danger" onclick="deleteReportFromDetails(${report.id})">
                <i class="fas fa-trash"></i> Delete Report
              </button>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('reportDetailsModal');
    if (existingModal) {
      existingModal.remove();
    }

    // Add modal to document
    document.body.insertAdjacentHTML('beforeend', modalContent);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('reportDetailsModal'));
    modal.show();

    // Clean up modal on hide
    document.getElementById('reportDetailsModal').addEventListener('hidden.bs.modal', function () {
      this.remove();
    });

  } catch (error) {
    console.error('Failed to load report details:', error);
    await showAlertDialog({
      title: 'Error',
      message: 'Failed to load report details. Please try again.',
      type: 'danger',
      buttonText: 'OK'
    });
  }
}

// Delete report from details modal
async function deleteReportFromDetails(reportId) {
  const modal = bootstrap.Modal.getInstance(document.getElementById('reportDetailsModal'));
  if (modal) modal.hide();
  
  await deleteReport(reportId);
}
