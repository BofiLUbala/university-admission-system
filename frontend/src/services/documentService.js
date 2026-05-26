import api from './api';

const documentService = {
  getDocuments: async () => {
    const response = await api.get('documents/documents/');
    return response.data;
  },

  uploadDocument: async (formData) => {
    // formData should contain application (id), document_type, and file
    const response = await api.post('documents/documents/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteDocument: async (id) => {
    const response = await api.delete(`documents/documents/${id}/`);
    return response.data;
  },

  reviewDocument: async (id, reviewData) => {
    // reviewData contains { status: 'APPROVED' | 'REJECTED', rejection_reason: '...' }
    const response = await api.post(`documents/documents/${id}/review/`, reviewData);
    return response.data;
  }
};

export default documentService;
