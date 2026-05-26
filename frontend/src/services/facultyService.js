import api from './api';

const facultyService = {
  getFaculties: async () => {
    const response = await api.get('faculties/faculties/');
    return response.data;
  },

  createFaculty: async (data) => {
    const response = await api.post('faculties/faculties/', data);
    return response.data;
  },

  updateFaculty: async (id, data) => {
    const response = await api.put(`faculties/faculties/${id}/`, data);
    return response.data;
  },

  deleteFaculty: async (id) => {
    const response = await api.delete(`faculties/faculties/${id}/`);
    return response.data;
  },

  getDepartments: async () => {
    const response = await api.get('faculties/departments/');
    return response.data;
  },

  createDepartment: async (data) => {
    const response = await api.post('faculties/departments/', data);
    return response.data;
  },

  updateDepartment: async (id, data) => {
    const response = await api.put(`faculties/departments/${id}/`, data);
    return response.data;
  },

  deleteDepartment: async (id) => {
    const response = await api.delete(`faculties/departments/${id}/`);
    return response.data;
  }
};

export default facultyService;
