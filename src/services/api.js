import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

export const api = {
  // 1. Start the Job with Optional Params
  startAnalysis: async (productName, mau = 0, arpu = 0.0) => {
    const response = await axios.post(`${API_URL}/analyze`, {
      product_name: productName,
      monthly_active_users: mau, 
      avg_revenue_per_user: arpu
    });
    
    // Return the full object so the frontend can extract job_id safely
    // Expected response: { job_id: "uuid...", status: "queued", ... }
    return response.data; 
  },
  cancelJob: async (jobId) => {
    const response = await axios.post(`${API_URL}/cancel/${jobId}`);
    return response.data;
  },

  // 2. Check Job Status
  getStatus: async (jobId) => {
    // Safety check for undefined ID
    if (!jobId) throw new Error("Cannot poll status: Job ID is missing");
    
    const response = await axios.get(`${API_URL}/status/${jobId}`);
    return response.data;
  },

  // 3. Get Download Link
  getDownloadUrl: (jobId) => `${API_URL}/report/${jobId}`
};