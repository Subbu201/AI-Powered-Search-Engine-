import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_BASE_URL || '') + '/api/analytics';

class AnalyticsService {
  async getOverview() {
    const response = await axios.get(`${API_URL}/overview`);
    return response.data;
  }

  async getLanguageStats(repositoryId) {
    const url = repositoryId 
        ? `${API_URL}/languages?repositoryId=${repositoryId}` 
        : `${API_URL}/languages`;
    const response = await axios.get(url);
    return response.data;
  }

  async getTopSearches() {
    const response = await axios.get(`${API_URL}/top-searches`);
    return response.data;
  }

  async getRepositoryStats() {
    const response = await axios.get(`${API_URL}/repository-stats`);
    return response.data;
  }
}

export default new AnalyticsService();

