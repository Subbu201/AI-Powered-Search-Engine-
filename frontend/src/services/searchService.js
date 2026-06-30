import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_BASE_URL || '') + '/api/search';

import AuthService from './authService';

class SearchService {
  async searchByKeyword(keyword) {
    let url = `${API_URL}?keyword=${encodeURIComponent(keyword)}`;
    const user = AuthService.getCurrentUser();
    if (user && user.id) {
        url += `&userId=${user.id}`;
    }
    const response = await axios.get(url);
    return response.data;
  }

  async searchByLanguage(language) {
    const response = await axios.get(`${API_URL}/language/${encodeURIComponent(language)}`);
    return response.data;
  }

  async searchByRepository(repositoryId) {
    const response = await axios.get(`${API_URL}/repository/${repositoryId}`);
    return response.data;
  }

  async searchByFileName(fileName) {
    const response = await axios.get(`${API_URL}/file/${encodeURIComponent(fileName)}`);
    return response.data;
  }
}

export default new SearchService();

