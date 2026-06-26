import axios from 'axios';

const API_URL = '/api/dashboard/';

class DashboardService {
  async getStats() {
    const response = await axios.get(API_URL + 'stats');
    return response.data;
  }
}

export default new DashboardService();
