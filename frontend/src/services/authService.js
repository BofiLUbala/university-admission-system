import api from './api';

const authService = {
  login: async (credentials) => {
    const response = await api.post('accounts/login/', credentials);
    if (response.data.access) {
      localStorage.setItem('ulk_token', response.data.access);
      localStorage.setItem('ulk_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (studentData) => {
    const response = await api.post('accounts/register/', studentData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('ulk_token');
    localStorage.removeItem('ulk_user');
  },

  getProfile: async () => {
    const response = await api.get('accounts/profile/');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('accounts/profile/', profileData);
    return response.data;
  },

  patchProfile: async (profileData) => {
    const response = await api.patch('accounts/profile/', profileData);
    return response.data;
  }
};

export default authService;
