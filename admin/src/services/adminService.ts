import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const adminService = {
  login: async (username: string, password: string) => {
    const response = await axios.post(`${API_URL}/api/admin/login/`, {
      username,
      password
    });
    
    if (response.data.token) {
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },
  
  getProfile: async () => {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await axios.get(`${API_URL}/api/admin/profile/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    return response.data;
  }
};
