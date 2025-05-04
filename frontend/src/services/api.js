import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config);
    return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
    (response) => {
        console.log('API Response:', response);
        return response;
    },
    (error) => {
        console.error('API Error:', error.response?.data || error);
        return Promise.reject(error);
    }
);

// Create a BNPL plan
export const createPlan = async (planData) => {
    const response = await api.post('/plans/', planData);
    return response.data;
};

// Get plans for the user or merchant
export const getPlans = async () => {
    const response = await api.get('/plans/');
    return response.data;
};

// Get analytics data (merchant only)
export const getAnalytics = async () => {
    const response = await api.get('/analytics/');
    return response.data;
};

// Pay an installment
export const payInstallment = async (installmentId) => {
    const response = await api.post(`/installments/${installmentId}/pay/`);
    return response.data;
};

// Login user
export const login = async (email, password) => {
    try {
        console.log('Login attempt with:', { email });
        const response = await api.post('/login/', {
            email: email.trim(),
            password: password
        });
        console.log('Login successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('Login failed:', error.response?.data || error);
        throw error;
    }
};