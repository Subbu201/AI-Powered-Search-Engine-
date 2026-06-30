import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_BASE_URL || '') + '/api/ai';

class AIService {
  async explainCode(fileId) {
    const response = await axios.post(`${API_URL}/explain/${fileId}`);
    return response.data.result;
  }

  async summarizeCode(fileId) {
    const response = await axios.post(`${API_URL}/summary/${fileId}`);
    return response.data.result;
  }

  async suggestImprovements(fileId) {
    const response = await axios.post(`${API_URL}/suggestions/${fileId}`);
    return response.data.result;
  }
}

export default new AIService();

