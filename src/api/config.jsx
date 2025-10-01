import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

function refreshToken() {
    return axios.get('/tokens/refresh', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('refreshToken')
        },
        skipAuthRefresh: true
    })
        .then(function(response) {
            const newAccessToken = response.data.token;
            localStorage.setItem('accessToken', newAccessToken);
            return newAccessToken;
        });
}

// Request interceptor
axios.interceptors.request.use(function(config) {
    const token = localStorage.getItem('accessToken');
    if (token && !config.skipAuthRefresh) {
        config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
});

// Response interceptor
axios.interceptors.response.use(
    function(response) {
        return response;
    },
    function(error) {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest.skipAuthRefresh) {
            if (isRefreshing) {
                // Queue this request until refresh completes
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then(function(token) {
                        originalRequest.headers.Authorization = 'Bearer ' + token;
                        return axios.request(originalRequest);
                    })
                    .catch(function(err) {
                        return Promise.reject(err);
                    });
            }

            isRefreshing = true;
            originalRequest._retry = true;

            return refreshToken()
                .then(function(newToken) {
                    isRefreshing = false;
                    processQueue(null, newToken);
                    originalRequest.headers.Authorization = 'Bearer ' + newToken;
                    return axios.request(originalRequest);
                })
                .catch(function(refreshError) {
                    isRefreshing = false;
                    processQueue(refreshError, null);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/signin';
                    return Promise.reject(refreshError);
                });
        }

        return Promise.reject(error);
    }
);

export default axios;
