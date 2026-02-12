import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 402 || error.response?.data?.message?.includes('limit')) {
            // Redirect to pricing on limits
            if (window.location.pathname !== '/pricing') {
                window.location.href = '/pricing';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
