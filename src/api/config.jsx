import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

let refreshPromise = null;

axios.interceptors.request.use(function(config) {
    if (!config.headers.Authorization) {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = 'Bearer ' + token;
        }
    }
    return config;
});

axios.interceptors.response.use(
    function(response) {
        return response;
    },
    async function(error) {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Reuse existing refresh promise if already refreshing
            if (!refreshPromise) {
                refreshPromise = axios.get('/tokens/refresh', {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('refreshToken') },
                    _retry: true
                })
                    .then(response => {
                        localStorage.setItem('accessToken', response.data.token);
                    })
                    .catch(() => {
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        window.location.href = '/signin';
                        throw error;
                    })
                    .finally(() => {
                        refreshPromise = null;
                    });
            }

            await refreshPromise;
            delete originalRequest.headers.Authorization;
            return axios(originalRequest); // Retry the original request
        }

        return Promise.reject(error);
    }
);

export default axios;
