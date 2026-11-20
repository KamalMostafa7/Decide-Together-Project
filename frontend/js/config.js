const API_URL = 'http://localhost:3000/api';

const config = {
  API_URL,
  endpoints: {
    auth: {
      register: `${API_URL}/auth/register`,
      login: `${API_URL}/auth/login`,
      me: `${API_URL}/auth/me`
    },
    reports: {
      all: `${API_URL}/reports`,
      stats: `${API_URL}/reports/stats`,
      byId: (id) => `${API_URL}/reports/${id}`,
      update: (id) => `${API_URL}/reports/${id}`,
      updateStatus: (id) => `${API_URL}/reports/${id}/status`,
      delete: (id) => `${API_URL}/reports/${id}`
    },
    comments: {
      all: `${API_URL}/comments`,
      create: `${API_URL}/comments`,
      byReport: (id) => `${API_URL}/comments/report/${id}`,
      delete: (id) => `${API_URL}/comments/${id}`
    },
    votes: {
      all: `${API_URL}/votes`,
      create: `${API_URL}/votes`,
      byReport: (id) => `${API_URL}/votes/report/${id}`
    },
    notifications: {
      all: `${API_URL}/notifications`,
      markRead: (id) => `${API_URL}/notifications/${id}/read`,
      markAllRead: `${API_URL}/notifications/read-all`
    }
  }
};
