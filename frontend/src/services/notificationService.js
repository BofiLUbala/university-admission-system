import api from './api';

const notificationService = {
  getNotifications: async () => {
    const response = await api.get('notifications/notifications/');
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.post('notifications/notifications/mark_all_as_read/');
    return response.data;
  }
};

export default notificationService;
