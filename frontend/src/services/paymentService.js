import api from './api';

const paymentService = {
  getPayments: async () => {
    const response = await api.get('payments/payments/');
    return response.data;
  },

  createPayment: async (paymentData) => {
    // paymentData contains { application: id, operator: 'MPESA' | 'AIRTEL'..., phone_number: '...' }
    const response = await api.post('payments/payments/', paymentData);
    return response.data;
  },

  downloadReceipt: async (paymentId) => {
    const response = await api.get(`payments/payments/${paymentId}/receipt/`, {
      responseType: 'blob', // Important for handling binary files in Axios
    });
    return response.data;
  }
};

export default paymentService;
