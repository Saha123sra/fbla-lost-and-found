import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============ AUTH ============
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  registerAdmin: (data) => api.post('/auth/register/admin', data),
  login: (data) => api.post('/auth/login', data),
  loginOwner: (data) => api.post('/auth/login/owner', data),
  verifyCode: (code) => api.post('/auth/verify-code', { code }),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.patch('/auth/me', data),
  changePassword: (data) => api.post('/auth/change-password', data)
};

// ============ ITEMS ============
export const itemsAPI = {
  getAll: (params) => api.get('/items', { params }),
  getOne: (id) => api.get(`/items/${id}`),
  create: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return api.post('/items', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  update: (id, data) => api.patch(`/items/${id}`, data),
  delete: (id) => api.delete(`/items/${id}`),
  getCategories: () => api.get('/items/meta/categories'),
  getLocations: () => api.get('/items/meta/locations')
};

// ============ CLAIMS ============
export const claimsAPI = {
  getAll: () => api.get('/claims'),
  getOne: (id) => api.get(`/claims/${id}`),
  create: (data) => api.post('/claims', data),
  update: (id, data) => api.patch(`/claims/${id}`, data),
  cancel: (id) => api.post(`/claims/${id}/cancel`)
};

// ============ REQUESTS (Lost Item Pre-Registration) ============
export const requestsAPI = {
  getAll: () => api.get('/requests'),
  getOne: (id) => api.get(`/requests/${id}`),
  checkMatches: (data) => api.post('/requests/check-matches', data),
  create: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return api.post('/requests', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  cancel: (id) => api.delete(`/requests/${id}`),
  findMatches: (id) => api.post(`/requests/match/${id}`)
};

// ============ ADMIN ============
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getItems: (params) => api.get('/admin/items', { params }),
  getClaims: (params) => api.get('/admin/claims', { params }),
  getStudents: (params) => api.get('/admin/students', { params }),
  getAuditLog: (params) => api.get('/admin/audit-log', { params }),
  bulkUpdateItems: (data) => api.post('/admin/items/bulk-update', data),
  getNotifications: () => api.get('/admin/notifications'),
  markNotificationRead: (id) => api.patch(`/admin/notifications/${id}/read`)
};

// ============ OWNER ============
export const ownerAPI = {
  getStats: () => api.get('/owner/stats'),
  getPendingAdmins: () => api.get('/owner/pending-admins'),
  getAdmins: (status) => api.get('/owner/admins', { params: { status } }),
  approveAdmin: (id) => api.post(`/owner/approve-admin/${id}`),
  denyAdmin: (id, reason) => api.post(`/owner/deny-admin/${id}`, { reason }),
  deactivateAdmin: (id, reason) => api.post(`/owner/deactivate-admin/${id}`, { reason })
};

// ============ FAQ ============
export const faqAPI = {
  getAll: (category) => api.get('/faq', { params: { category } }),
  getCategories: () => api.get('/faq/categories')
};

// ============ TESTIMONIALS ============
export const testimonialsAPI = {
  getApproved: (limit) => api.get('/testimonials', { params: { limit } }),
  submit: (data) => api.post('/testimonials', data),
  getAll: (status) => api.get('/testimonials/all', { params: { status } }),
  updateStatus: (id, status) => api.patch(`/testimonials/${id}`, { status })
};

export default api;
