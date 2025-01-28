import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Create axios instance with retry functionality
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 60000, // Increase timeout to 60 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add retry interceptor
axiosInstance.interceptors.response.use(undefined, async (err) => {
  const { config, message } = err;
  if (!config || !config.retry) {
    return Promise.reject(err);
  }
  config.retry -= 1;
  if (config.retry === 0) {
    return Promise.reject(err);
  }
  await new Promise(resolve => setTimeout(resolve, config.retryDelay || 1000));
  return axiosInstance(config);
});

interface FeedbackData {
  complaint_id: string;
  feedback_message: string;
  rating: number;
  category?: string;
  subcategory?: string;
  name?: string;
  email?: string;
}

export const feedbackService = {
  submitFeedback: async (data: FeedbackData) => {
    try {
      const response = await axiosInstance.post('/complaints/feedback/', {
        complaint: data.complaint_id,  // This will now be the complaint type string
        feedback_message: `Category: ${data.category}\nSubcategory: ${data.subcategory}\n\n${data.feedback_message}`,
        rating: data.rating,
        user_name: data.name,
        user_email: data.email
      });
      return response.data;
    } catch (error: any) {
      console.error('Submission error details:', error);
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('Failed to submit feedback');
    }
  },

  getFeedback: async (complaintId: string) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${API_URL}/complaints/feedback/?complaint_id=${complaintId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
