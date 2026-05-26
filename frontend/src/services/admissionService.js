import api from './api';

const admissionService = {
  getApplications: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.faculty) params.append('faculty', filters.faculty);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);

    const response = await api.get(`admissions/applications/?${params.toString()}`);
    return response.data;
  },

  getApplicationById: async (id) => {
    const response = await api.get(`admissions/applications/${id}/`);
    return response.data;
  },

  createApplication: async (data) => {
    const response = await api.post('admissions/applications/', data);
    return response.data;
  },

  updateApplication: async (id, data) => {
    const response = await api.put(`admissions/applications/${id}/`, data);
    return response.data;
  },

  patchApplication: async (id, data) => {
    const response = await api.patch(`admissions/applications/${id}/`, data);
    return response.data;
  },

  reviewApplication: async (id, reviewData) => {
    // reviewData contains { status: 'APPROVED' | 'REJECTED' ..., admin_comment: '...' }
    const response = await api.post(`admissions/applications/${id}/review/`, reviewData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('admissions/students/');
    return response.data;
  },

  saveProfile: async (data) => {
    const response = await api.post('admissions/students/', data);
    return response.data;
  }
};

export default admissionService;
