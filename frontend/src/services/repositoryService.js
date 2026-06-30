import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_BASE_URL || '') + '/api/repositories';

class RepositoryService {
  async getAll() {
    const response = await axios.get(API_URL);
    return response.data;
  }

  async getById(id) {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  }

  async create(repository) {
    const response = await axios.post(API_URL, repository);
    return response.data;
  }

  async update(id, repository) {
    const response = await axios.put(`${API_URL}/${id}`, repository);
    return response.data;
  }

  async importRepo(repository) {
    const response = await axios.post(`${API_URL}/import`, repository);
    return response.data;
  }

  async delete(id) {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  }
}

export default new RepositoryService();

