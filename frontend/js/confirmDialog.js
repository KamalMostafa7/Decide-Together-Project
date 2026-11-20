// Custom Confirmation Dialog System

/**
 * Show a custom confirmation dialog
 * @param {Object} options - Configuration options
 * @param {string} options.title - Dialog title
 * @param {string} options.message - Dialog message
 * @param {string} options.type - Dialog type: 'warning', 'danger', 'info', 'success'
 * @param {string} options.confirmText - Text for confirm button (default: 'Confirm')
 * @param {string} options.cancelText - Text for cancel button (default: 'Cancel')
 * @param {string} options.confirmButtonClass - CSS class for confirm button (default: 'btn-confirm')
 * @returns {Promise<boolean>} - Returns true if confirmed, false if cancelled
 */
function showConfirmDialog(options = {}) {
  return new Promise((resolve) => {
    const {
      title = 'Confirmation',
      message = 'Are you sure?',
      type = 'warning',
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      confirmButtonClass = 'btn-confirm'
    } = options;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'custom-confirm-overlay';
    
    // Get icon based on type
    const icons = {
      warning: 'fa-exclamation-triangle',
      danger: 'fa-exclamation-circle',
      success: 'fa-check-circle',
      info: 'fa-info-circle'
    };
    const icon = icons[type] || icons.warning;

    // Create dialog
    overlay.innerHTML = `
      <div class="custom-confirm-dialog">
        <div class="custom-confirm-header">
          <div class="custom-confirm-icon ${type}">
            <i class="fas ${icon}"></i>
          </div>
          <h5 class="custom-confirm-title">${title}</h5>
        </div>
        <div class="custom-confirm-body">
          ${message}
        </div>
        <div class="custom-confirm-footer">
          <button class="custom-confirm-btn btn-cancel" data-action="cancel">
            ${cancelText}
          </button>
          <button class="custom-confirm-btn ${confirmButtonClass}" data-action="confirm">
            ${confirmText}
          </button>
        </div>
      </div>
    `;

    // Add to document
    document.body.appendChild(overlay);

    // Handle button clicks
    const handleClick = (e) => {
      const action = e.target.closest('[data-action]')?.dataset.action;
      if (action) {
        overlay.style.animation = 'fadeOut 0.2s ease-in-out';
        setTimeout(() => {
          overlay.remove();
        }, 200);
        resolve(action === 'confirm');
      }
    };

    overlay.addEventListener('click', (e) => {
      // Close on overlay click (outside dialog)
      if (e.target === overlay) {
        overlay.style.animation = 'fadeOut 0.2s ease-in-out';
        setTimeout(() => {
          overlay.remove();
        }, 200);
        resolve(false);
      }
      handleClick(e);
    });

    // Focus on confirm button
    setTimeout(() => {
      overlay.querySelector('[data-action="confirm"]')?.focus();
    }, 100);

    // Handle Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        overlay.style.animation = 'fadeOut 0.2s ease-in-out';
        setTimeout(() => {
          overlay.remove();
        }, 200);
        resolve(false);
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  });
}

/**
 * Show a custom alert dialog (info/success message)
 * @param {Object} options - Configuration options
 * @param {string} options.title - Dialog title
 * @param {string} options.message - Dialog message
 * @param {string} options.type - Dialog type: 'success', 'info', 'warning', 'danger'
 * @param {string} options.buttonText - Text for OK button (default: 'OK')
 * @returns {Promise<void>}
 */
function showAlertDialog(options = {}) {
  return new Promise((resolve) => {
    const {
      title = 'Notice',
      message = '',
      type = 'info',
      buttonText = 'OK'
    } = options;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'custom-alert-overlay';
    
    // Get icon based on type
    const icons = {
      warning: 'fa-exclamation-triangle',
      danger: 'fa-exclamation-circle',
      success: 'fa-check-circle',
      info: 'fa-info-circle'
    };
    const icon = icons[type] || icons.info;

    const buttonClasses = {
      success: 'btn-success',
      danger: 'btn-danger',
      warning: 'btn-confirm',
      info: 'btn-confirm'
    };
    const buttonClass = buttonClasses[type] || 'btn-confirm';

    // Create dialog
    overlay.innerHTML = `
      <div class="custom-alert-dialog">
        <div class="custom-confirm-header">
          <div class="custom-confirm-icon ${type}">
            <i class="fas ${icon}"></i>
          </div>
          <h5 class="custom-confirm-title">${title}</h5>
        </div>
        <div class="custom-confirm-body">
          ${message}
        </div>
        <div class="custom-confirm-footer">
          <button class="custom-confirm-btn ${buttonClass}" data-action="ok">
            ${buttonText}
          </button>
        </div>
      </div>
    `;

    // Add to document
    document.body.appendChild(overlay);

    // Handle button clicks
    const handleClick = (e) => {
      const action = e.target.closest('[data-action]')?.dataset.action;
      if (action === 'ok') {
        overlay.style.animation = 'fadeOut 0.2s ease-in-out';
        setTimeout(() => {
          overlay.remove();
        }, 200);
        resolve();
      }
    };

    overlay.addEventListener('click', (e) => {
      // Close on overlay click (outside dialog)
      if (e.target === overlay) {
        overlay.style.animation = 'fadeOut 0.2s ease-in-out';
        setTimeout(() => {
          overlay.remove();
        }, 200);
        resolve();
      }
      handleClick(e);
    });

    // Focus on OK button
    setTimeout(() => {
      overlay.querySelector('[data-action="ok"]')?.focus();
    }, 100);

    // Handle Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        overlay.style.animation = 'fadeOut 0.2s ease-in-out';
        setTimeout(() => {
          overlay.remove();
        }, 200);
        resolve();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  });
}

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;
document.head.appendChild(style);
