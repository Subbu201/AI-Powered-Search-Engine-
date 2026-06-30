import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_BASE_URL || '') + '/api/dashboard/';

class DashboardService {
  async getStats() {
    const response = await axios.get(API_URL + 'stats');
    return response.data;
  }
}

export default new DashboardService();

