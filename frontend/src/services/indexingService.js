import axios from 'axios';

const API_URL = '/api/index';

class IndexingService {
  async indexRepository(repositoryId) {
    const response = await axios.post(`${API_URL}/${repositoryId}`);
    return response.data;
  }

  async getIndexingStatus(repositoryId) {
    const response = await axios.get(`${API_URL}/status/${repositoryId}`);
    return response.data;
  }

  async getPerformance(repositoryId) {
    const response = await axios.get(`${API_URL}/performance/${repositoryId}`);
    return response.data;
  }

  async getIndexedFiles(repositoryId) {
    const response = await axios.get(`${API_URL}/files/${repositoryId}`);
    return response.data;
  }

  async getFileDetails(fileId) {
    const response = await axios.get(`${API_URL}/file/${fileId}`);
    return response.data;
  }
}

export default new IndexingService();
