// Browse reports page
let allReports = [];
let filteredReports = [];
let currentReport = null;
let currentPage = 1;
const reportsPerPage = 15;

// Fake images for Egyptian issues
const reportImages = {
    'infrastructure': [
        'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400',
        'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=400',
        'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400'
    ],
    'cleanliness': [
        'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400',
        'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=400',
        'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400',
        'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400'
    ],
    'safety': [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400',
        'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400',
        'https://images.unsplash.com/photo-1567095751004-aa51a2690368?w=400'
    ],
    'utilities': [
        'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
        'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400',
        'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=400',
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400'
    ],
    'other': [
        'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400',
        'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400',
        'https://images.unsplash.com/photo-1582192730841-2a682d7375f9?w=400',
        'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400'
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    populateGovernorateFilter();
    loadReports();

    // Check if there's a report ID in URL and open it
    checkUrlForReport();

    // Filter change handlers
    document.getElementById('browseGovernorateFilter').addEventListener('change', () => {
        currentPage = 1;
        loadReports();
    });
    document.getElementById('browseCategoryFilter').addEventListener('change', () => {
        currentPage = 1;
        loadReports();
    });
    document.getElementById('browseStatusFilter').addEventListener('change', () => {
        currentPage = 1;
        loadReports();
    });
    document.getElementById('browseSortFilter').addEventListener('change', () => {
        currentPage = 1;
        loadReports();
    });

    // Search input handler with debounce
    let searchTimeout;
    document.getElementById('searchInput').addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentPage = 1;
            filterAndDisplayReports();
        }, 300);
    });

    // Comment submission
    const submitCommentBtn = document.getElementById('submitCommentBtn');
    if (submitCommentBtn) {
        submitCommentBtn.addEventListener('click', submitComment);
    }

    // Vote buttons
    document.getElementById('upvoteBtn').addEventListener('click', () => vote('upvote'));
    document.getElementById('downvoteBtn').addEventListener('click', () => vote('downvote'));
});

// Check URL for report ID and open it automatically
function checkUrlForReport() {
    const urlParams = new URLSearchParams(window.location.search);
    const reportId = urlParams.get('id');
    
    if (reportId) {
        // Wait a bit for reports to load, then show the specific report
        setTimeout(() => {
            const id = parseInt(reportId);
            const report = allReports.find(r => r.id === id);
            if (report) {
                openReportModal(id);
            }
        }, 1500);
    }
}
function populateGovernorateFilter() {
    const select = document.getElementById('browseGovernorateFilter');
    if (!select || typeof getGovernoratesList !== 'function') return;

    const governorates = getGovernoratesList();
    const currentLang = localStorage.getItem('language') || 'en';

    governorates.forEach(gov => {
        const option = document.createElement('option');
        option.value = gov;
        option.textContent = getGovernorateName(gov, currentLang);
        select.appendChild(option);
    });
}

async function loadReports() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const noReports = document.getElementById('noReports');
    const reportsGrid = document.getElementById('reportsGrid');
    const reportsCount = document.getElementById('reportsCount');

    loadingSpinner.style.display = 'block';
    noReports.style.display = 'none';
    reportsGrid.innerHTML = '';
    document.getElementById('paginationContainer').style.display = 'none';

    try {
        const governorate = document.getElementById('browseGovernorateFilter').value;
        const category = document.getElementById('browseCategoryFilter').value;
        const status = document.getElementById('browseStatusFilter').value;
        const sort = document.getElementById('browseSortFilter').value;

        let url = config.endpoints.reports.all;
        const params = new URLSearchParams();

        if (governorate) params.append('governorate', governorate);
        if (category) params.append('category', category);
        if (status) params.append('status', status);

        if (params.toString()) {
            url += '?' + params.toString();
        }

        const response = await fetch(url);
        const data = await response.json();
        allReports = data.reports || [];

        // Sort reports
        sortReports(allReports, sort);

        loadingSpinner.style.display = 'none';

        if (allReports.length === 0) {
            noReports.style.display = 'block';
            reportsCount.textContent = '0';
        } else {
            filterAndDisplayReports();
        }
    } catch (error) {
        console.error('Failed to load reports:', error);
        loadingSpinner.style.display = 'none';
        noReports.style.display = 'block';
        alert('Failed to load reports. Please try again.');
    }
}

function filterAndDisplayReports() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    // Filter reports based on search
    if (searchTerm) {
        filteredReports = allReports.filter(report => 
            report.title.toLowerCase().includes(searchTerm) ||
            report.description.toLowerCase().includes(searchTerm) ||
            report.address.toLowerCase().includes(searchTerm)
        );
    } else {
        filteredReports = [...allReports];
    }

    const reportsCount = document.getElementById('reportsCount');
    const noReports = document.getElementById('noReports');
    
    if (filteredReports.length === 0) {
        noReports.style.display = 'block';
        document.getElementById('paginationContainer').style.display = 'none';
        reportsCount.textContent = '0';
    } else {
        noReports.style.display = 'none';
        reportsCount.textContent = filteredReports.length;
        displayReportsWithPagination();
    }
}

function displayReportsWithPagination() {
    const startIndex = (currentPage - 1) * reportsPerPage;
    const endIndex = startIndex + reportsPerPage;
    const reportsToShow = filteredReports.slice(startIndex, endIndex);
    
    displayReports(reportsToShow);
    renderPagination();
}

function renderPagination() {
    const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
    const paginationContainer = document.getElementById('paginationContainer');
    const pagination = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }
    
    paginationContainer.style.display = 'block';
    pagination.innerHTML = '';
    
    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>`;
    prevLi.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            displayReportsWithPagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    pagination.appendChild(prevLi);
    
    // Page numbers
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = i;
            displayReportsWithPagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        pagination.appendChild(li);
    }
    
    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>`;
    nextLi.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            displayReportsWithPagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    pagination.appendChild(nextLi);
}

function sortReports(reports, sortBy) {
    switch (sortBy) {
        case 'newest':
            reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case 'oldest':
            reports.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
        case 'most_voted':
            reports.sort((a, b) => ((b.upvotes || 0) - (b.downvotes || 0)) - ((a.upvotes || 0) - (a.downvotes || 0)));
            break;
    }
}

function getReportImage(report) {
    if (report.image_url) return report.image_url;
    
    const category = report.category || 'other';
    const images = reportImages[category] || reportImages['other'];
    const index = report.id % images.length;
    return images[index];
}

function displayReports(reports) {
    const grid = document.getElementById('reportsGrid');
    const currentLang = localStorage.getItem('language') || 'en';

    const categoryIcons = {
        'infrastructure': 'fa-road',
        'cleanliness': 'fa-broom',
        'safety': 'fa-shield-alt',
        'utilities': 'fa-lightbulb',
        'other': 'fa-ellipsis-h'
    };
    
    const statusIcons = {
        'open': 'fa-circle',
        'in_progress': 'fa-spinner',
        'resolved': 'fa-check-circle'
    };

    grid.innerHTML = reports.map(report => {
        const categoryIcon = categoryIcons[report.category] || 'fa-tag';
        const statusIcon = statusIcons[report.status] || 'fa-circle';
        
        return `
        <div class="report-card" onclick="openReportModal(${report.id})">
            <img src="${getReportImage(report)}" alt="${report.title}" class="report-thumbnail">
            <div class="report-content">
                <h6 class="report-title">
                    <i class="fas ${categoryIcon} text-primary me-2"></i>
                    ${report.title}
                </h6>
                <div class="report-meta mb-2">
                    <span class="badge bg-light text-dark">
                        <i class="fas fa-hashtag"></i> ${report.id}
                    </span>
                    <span class="badge bg-secondary">
                        <i class="fas fa-map-marker-alt"></i> ${getGovernorateName(report.governorate, currentLang)}
                    </span>
                </div>
                <p class="report-description">${report.description}</p>
                <div class="d-flex justify-content-between align-items-center mt-2">
                    <div class="report-stats">
                        <span class="badge bg-success me-1">
                            <i class="fas fa-thumbs-up"></i> ${report.upvotes || 0}
                        </span>
                        <span class="badge bg-danger me-1">
                            <i class="fas fa-thumbs-down"></i> ${report.downvotes || 0}
                        </span>
                        <span class="badge bg-info">
                            <i class="fas fa-comments"></i> ${report.commentCount || 0}
                        </span>
                    </div>
                    <span class="status-badge bg-${getStatusColor(report.status)} text-white">
                        <i class="fas ${statusIcon}"></i>
                        ${getStatusText(report.status)}
                    </span>
                </div>
            </div>
        </div>
    `;
    }).join('');
}

function getStatusColor(status) {
    const colors = {
        'open': 'danger',
        'in_progress': 'warning',
        'resolved': 'success'
    };
    return colors[status] || 'secondary';
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

async function openReportModal(reportId) {
    const report = allReports.find(r => r.id === reportId);
    if (!report) return;

    currentReport = report;
    const currentLang = localStorage.getItem('language') || 'en';

    // Populate modal
    document.getElementById('modalReportTitle').textContent = `#${report.id} - ${report.title}`;
    document.getElementById('modalReportImage').src = getReportImage(report);
    document.getElementById('modalReportGovernorate').textContent = getGovernorateName(report.governorate, currentLang);
    document.getElementById('modalReportCategory').textContent = getCategoryText(report.category);
    
    const statusBadge = document.getElementById('modalReportStatus');
    statusBadge.textContent = getStatusText(report.status);
    statusBadge.className = `status-badge bg-${getStatusColor(report.status)}`;

    document.getElementById('modalReportDescription').textContent = report.description;
    
    // Show/hide suggested solution
    const solutionSection = document.getElementById('modalSolutionSection');
    const solutionText = document.getElementById('modalReportSolution');
    if (report.suggested_solution) {
        solutionText.textContent = report.suggested_solution;
        solutionSection.style.display = 'block';
    } else {
        solutionSection.style.display = 'none';
    }
    
    document.getElementById('modalReportUser').textContent = report.user?.name || 'Anonymous';
    document.getElementById('modalReportDate').textContent = new Date(report.createdAt).toLocaleDateString();
    document.getElementById('modalReportCity').textContent = report.city || report.governorate;

    // Set report URL
    const reportUrl = `${window.location.origin}/browse.html?id=${report.id}`;
    document.getElementById('reportUrlInput').value = reportUrl;

    // Update votes
    document.getElementById('upvoteCount').textContent = report.upvotes || 0;
    document.getElementById('downvoteCount').textContent = report.downvotes || 0;

    // Reset vote buttons to default state
    const upvoteBtn = document.getElementById('upvoteBtn');
    const downvoteBtn = document.getElementById('downvoteBtn');
    upvoteBtn.disabled = false;
    downvoteBtn.disabled = false;
    upvoteBtn.className = 'vote-btn';
    downvoteBtn.className = 'vote-btn';
    upvoteBtn.innerHTML = '<i class="fas fa-thumbs-up"></i> <span id="upvoteCount">' + (report.upvotes || 0) + '</span>';
    downvoteBtn.innerHTML = '<i class="fas fa-thumbs-down"></i> <span id="downvoteCount">' + (report.downvotes || 0) + '</span>';
    
    // Reset comment section to default state
    const commentText = document.getElementById('commentText');
    const submitBtn = document.getElementById('submitCommentBtn');
    commentText.disabled = false;
    commentText.placeholder = '';
    commentText.value = '';
    submitBtn.disabled = false;
    submitBtn.className = 'btn btn-primary btn-sm';

    // Show/hide vote and comment sections based on auth
    const isAuth = auth.isAuthenticated();
    const currentUser = auth.getUser();
    const isAdmin = auth.isAdmin();
    document.getElementById('voteSection').style.display = isAuth ? 'flex' : 'none';
    document.getElementById('addCommentSection').style.display = isAuth ? 'block' : 'none';

    // Show edit and delete buttons if user is report owner or admin
    const actionsSection = document.getElementById('reportActionsSection');
    const editBtn = document.getElementById('editReportBtn');
    if (isAuth && currentUser && currentUser.id === report.user_id) {
        actionsSection.style.display = 'flex';
        editBtn.style.display = 'inline-block';
    } else if (isAuth && isAdmin) {
        actionsSection.style.display = 'flex';
        editBtn.style.display = 'none';
    } else {
        actionsSection.style.display = 'none';
    }

    // Load comments (visible to everyone)
    await loadComments(reportId);
    
    // Check if user has already voted or commented
    if (isAuth) {
        await checkUserVoteStatus(reportId);
        await checkUserCommentStatus(reportId);
    }

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('reportModal'));
    modal.show();
}

async function loadComments(reportId) {
    const commentsSection = document.getElementById('commentsSection');
    
    try {
        const response = await fetch(config.endpoints.comments.byReport(reportId));
        const data = await response.json();
        const comments = data.comments || [];

        if (comments.length === 0) {
            commentsSection.innerHTML = '<p class="text-muted text-center">No comments yet</p>';
        } else {
            commentsSection.innerHTML = comments.map(comment => `
                <div class="comment-item">
                    <strong>${comment.user?.name || 'Anonymous'}</strong>
                    <small class="text-muted"> • ${new Date(comment.createdAt).toLocaleDateString()}</small>
                    <p class="mb-0 mt-1">${comment.content}</p>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Failed to load comments:', error);
        commentsSection.innerHTML = '<p class="text-muted text-center">Failed to load comments</p>';
    }
}

async function submitComment() {
    if (!auth.isAuthenticated()) {
        showAlert('Please login to add comments', 'warning');
        return;
    }

    const commentText = document.getElementById('commentText').value.trim();
    if (!commentText) {
        showAlert('Please enter a comment', 'warning');
        return;
    }

    try {
        const response = await auth.fetchWithAuth(config.endpoints.comments.create, {
            method: 'POST',
            body: JSON.stringify({
                report_id: currentReport.id,
                content: commentText
            })
        });

        if (response.ok) {
            document.getElementById('commentText').value = '';
            await loadComments(currentReport.id);
            
            // Disable the comment section after successful submission
            const commentTextArea = document.getElementById('commentText');
            const submitBtn = document.getElementById('submitCommentBtn');
            
            commentTextArea.disabled = true;
            commentTextArea.placeholder = 'You have already commented on this report';
            submitBtn.disabled = true;
            submitBtn.classList.add('btn-secondary');
            submitBtn.classList.remove('btn-primary');
            
            // Update comment count
            const report = allReports.find(r => r.id === currentReport.id);
            if (report) {
                report.commentCount = (report.commentCount || 0) + 1;
            }
            showAlert('Comment added successfully!', 'success');
        } else {
            const errorData = await response.json();
            showAlert(errorData.message || errorData.error || 'Failed to add comment', 'danger');
        }
    } catch (error) {
        console.error('Failed to add comment:', error);
        showAlert('Failed to add comment', 'danger');
    }
}

async function vote(voteType) {
    if (!auth.isAuthenticated()) {
        showAlert('Please login to vote', 'warning');
        return;
    }

    try {
        const response = await auth.fetchWithAuth(config.endpoints.votes.all, {
            method: 'POST',
            body: JSON.stringify({
                report_id: currentReport.id,
                vote_type: voteType
            })
        });

        if (response.ok) {
            const result = await response.json();
            
            // Reload report to get updated vote counts
            await loadReports();
            const updatedReport = allReports.find(r => r.id === currentReport.id);
            if (updatedReport) {
                currentReport = updatedReport;
                document.getElementById('upvoteCount').textContent = updatedReport.upvotes || 0;
                document.getElementById('downvoteCount').textContent = updatedReport.downvotes || 0;
                
                // Update button states
                await checkUserVoteStatus(currentReport.id);
                
                // Show appropriate message
                if (result.action === 'removed') {
                    showAlert('Vote removed!', 'info');
                } else {
                    showAlert(result.message || 'Vote recorded!', 'success');
                }
            }
        } else {
            const errorData = await response.json();
            showAlert(errorData.message || 'Failed to vote', 'danger');
        }
    } catch (error) {
        console.error('Failed to vote:', error);
        showAlert('Failed to vote', 'danger');
    }
}

// Copy report URL to clipboard
function copyReportUrl() {
    const urlInput = document.getElementById('reportUrlInput');
    urlInput.select();
    urlInput.setSelectionRange(0, 99999); // For mobile devices
    
    navigator.clipboard.writeText(urlInput.value).then(() => {
        const copyBtn = document.getElementById('copyUrlBtn');
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyBtn.classList.remove('btn-outline-primary');
        copyBtn.classList.add('btn-success');
        
        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.classList.remove('btn-success');
            copyBtn.classList.add('btn-outline-primary');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy URL:', err);
        alert('Failed to copy URL. Please copy manually.');
    });
}

// Helper function to show alerts
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Check if user has already voted on this report
async function checkUserVoteStatus(reportId) {
    try {
        const userId = auth.getUser()?.id;
        if (!userId) return;

        const response = await fetch(`${config.API_URL}/votes/report/${reportId}`);
        const data = await response.json();
        
        // Check if current user has voted
        const userVote = data.votes?.find(v => v.user_id === userId);
        
        const upvoteBtn = document.getElementById('upvoteBtn');
        const downvoteBtn = document.getElementById('downvoteBtn');
        
        // Reset buttons first
        upvoteBtn.classList.remove('btn-success');
        downvoteBtn.classList.remove('btn-danger');
        
        if (userVote) {
            // Highlight the voted button (but keep it enabled for changing/removing vote)
            if (userVote.vote_type === 'upvote') {
                upvoteBtn.classList.add('btn-success');
            } else {
                downvoteBtn.classList.add('btn-danger');
            }
        }
    } catch (error) {
        console.error('Failed to check vote status:', error);
    }
}

// Check if user has already commented on this report
async function checkUserCommentStatus(reportId) {
    try {
        const userId = auth.getUser()?.id;
        if (!userId) return;

        const response = await fetch(config.endpoints.comments.byReport(reportId));
        const data = await response.json();
        
        // Check if current user has commented
        const userComment = data.comments?.find(c => c.user_id === userId);
        
        if (userComment) {
            // Disable comment section
            const commentText = document.getElementById('commentText');
            const submitBtn = document.getElementById('submitCommentBtn');
            
            commentText.disabled = true;
            commentText.placeholder = 'You have already commented on this report';
            submitBtn.disabled = true;
            submitBtn.classList.add('btn-secondary');
            submitBtn.classList.remove('btn-primary');
        }
    } catch (error) {
        console.error('Failed to check comment status:', error);
    }
}

// Delete report
async function deleteReport() {
    if (!currentReport) return;
    
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
        const response = await auth.fetchWithAuth(config.endpoints.reports.delete(currentReport.id), {
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

// Open edit report modal with pre-filled data
function openEditReportModal() {
    if (!currentReport) return;

    // Populate form with current report data
    document.getElementById('editTitle').value = currentReport.title || '';
    document.getElementById('editDescription').value = currentReport.description || '';
    document.getElementById('editSolution').value = currentReport.suggested_solution || '';
    document.getElementById('editCategory').value = currentReport.category || '';
    document.getElementById('editCity').value = currentReport.city || '';
    document.getElementById('editAddress').value = currentReport.address || '';
    document.getElementById('editLatitude').value = currentReport.latitude || '';
    document.getElementById('editLongitude').value = currentReport.longitude || '';
    document.getElementById('editImageUrl').value = currentReport.image_url || '';

    // Populate governorate dropdown
    const governorateSelect = document.getElementById('editGovernorate');
    governorateSelect.innerHTML = '';
    const governoratesList = getGovernoratesList();
    governoratesList.forEach(gov => {
        const option = document.createElement('option');
        option.value = gov;
        option.textContent = gov;
        if (gov === currentReport.governorate) {
            option.selected = true;
        }
        governorateSelect.appendChild(option);
    });

    // Hide main modal and show edit modal
    const mainModal = bootstrap.Modal.getInstance(document.getElementById('reportModal'));
    if (mainModal) mainModal.hide();

    const editModal = new bootstrap.Modal(document.getElementById('editReportModal'));
    editModal.show();
}

// Save edited report
async function saveEditedReport() {
    if (!auth.isAuthenticated()) {
        showAlert('Please login to edit reports', 'warning');
        return;
    }

    if (!currentReport) return;

    const updatedData = {
        title: document.getElementById('editTitle').value.trim(),
        description: document.getElementById('editDescription').value.trim(),
        suggested_solution: document.getElementById('editSolution').value.trim(),
        category: document.getElementById('editCategory').value,
        governorate: document.getElementById('editGovernorate').value,
        city: document.getElementById('editCity').value.trim(),
        address: document.getElementById('editAddress').value.trim(),
        latitude: parseFloat(document.getElementById('editLatitude').value),
        longitude: parseFloat(document.getElementById('editLongitude').value),
        image_url: document.getElementById('editImageUrl').value.trim()
    };

    // Validation
    if (!updatedData.title || !updatedData.description || !updatedData.category || 
        !updatedData.governorate || isNaN(updatedData.latitude) || isNaN(updatedData.longitude)) {
        showAlert('Please fill in all required fields', 'warning');
        return;
    }

    try {
        const response = await auth.fetchWithAuth(config.endpoints.reports.update(currentReport.id), {
            method: 'PUT',
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            const data = await response.json();
            
            await showAlertDialog({
                title: 'Success!',
                message: 'Report has been updated successfully.',
                type: 'success',
                buttonText: 'OK'
            });

            // Close edit modal
            const editModal = bootstrap.Modal.getInstance(document.getElementById('editReportModal'));
            if (editModal) editModal.hide();

            // Reload reports and show updated report
            await loadReports();
            await showReportModal(currentReport.id);
        } else {
            const errorData = await response.json();
            await showAlertDialog({
                title: 'Error',
                message: errorData.error || 'Failed to update report. Please try again.',
                type: 'danger',
                buttonText: 'OK'
            });
        }
    } catch (error) {
        console.error('Failed to update report:', error);
        await showAlertDialog({
            title: 'Error',
            message: 'Failed to update report. Please check your connection and try again.',
            type: 'danger',
            buttonText: 'OK'
        });
    }
}
