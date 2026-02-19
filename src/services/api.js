import axios from 'axios';

// 1. Get the Space URL and Secret Key from Vite environment variables
// Make sure these are defined in your Render Dashboard / .env file
const API_URL = import.meta.env.VITE_APP_GATEWAY_URL || 'http://127.0.0.1:7860';
const GATEWAY_KEY = import.meta.env.VITE_APP_GATEWAY_SECRET_KEY;

console.log(API_URL)
console.log(GATEWAY_KEY)

// Create an axios instance to avoid repeating headers
const apiClient = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to attach the secret key to EVERY request
apiClient.interceptors.request.use((config) => {
  if (GATEWAY_KEY) {
    config.headers['X-API-Key'] = GATEWAY_KEY;
  }
  return config;
});

export const api = {
  // 1. Start the Job
  startAnalysis: async (productName, mau = 0, arpu = 0.0) => {
    // Note: Headers are now handled by the interceptor above
    const response = await apiClient.post(`/analyze`, {
      product_name: productName,
      monthly_active_users: mau, 
      avg_revenue_per_user: arpu
    });
    return response.data; 
  },

  // 2. Cancel the Job
  cancelJob: async (jobId) => {
    const response = await apiClient.post(`/cancel/${jobId}`);
    return response.data;
  },

  // 3. Check Job Status
  getStatus: async (jobId) => {
    if (!jobId) throw new Error("Cannot poll status: Job ID is missing");
    const response = await apiClient.get(`/status/${jobId}`);
    return response.data;
  },

  // 4. Get Download Link (Redirects to the Analysis service)
  getDownloadUrl: (jobId) => `${API_URL}/report/${jobId}`
};
