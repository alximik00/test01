import axios from 'axios';

// API URL can be configured via REACT_APP_API_URL environment variable
// Defaults to localhost if not set
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

