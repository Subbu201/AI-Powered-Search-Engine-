import axios from 'axios';

const API_URL = '/api/search';

class SearchService {
  async searchByKeyword(keyword) {
    const response = await axios.get(`${API_URL}?keyword=${encodeURIComponent(keyword)}`);
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
