import axios from 'axios';
 
const API_URL = 'http://localhost:8000/api';
 
// Create axios instance with retry functionality
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});
 
// Add retry interceptor
axiosInstance.interceptors.response.use(undefined, async (err) => {
  const { config } = err;
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
        complaint_id: data.complaint_id,
        category: data.category || '',
        subcategory: data.subcategory || '',
        feedback_message: data.feedback_message,
        rating: data.rating,
        name: data.name || '',
        email: data.email || ''
      });
      return response.data;
    } catch (error: any) {
      console.error('Submission error details:', error);
      // Better error reporting
      if (error.response?.data) {
        const data = error.response.data;
        const errorMessages = typeof data === 'object'
          ? Object.entries(data).map(([field, msg]) => `${field}: ${Array.isArray(msg) ? msg.join(', ') : msg}`).join('\n')
          : data;
        throw new Error(errorMessages || 'Failed to submit feedback');
      }
      throw new Error('Failed to submit feedback');
    }
  },
 
  getFeedback: async (complaintId: string) => {
    try {
      const response = await axiosInstance.get(`/complaints/feedback/?complaint_id=${complaintId}`);
      return response.data;
    } catch (error: any) {
      console.error('Fetching error:', error);
      throw new Error('Failed to fetch feedback');
    }
  }
};
 