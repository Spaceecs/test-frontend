import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        console.log(token);
        if (token) {
            config.headers = config.headers || {};
            (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }
    }
    return config;
});
