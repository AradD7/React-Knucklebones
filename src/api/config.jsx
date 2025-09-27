import axios from 'axios';

axios.defaults.baseURL = 'go-knucklebones-production.up.railway.app/api';

// Token refresh function
function refreshToken() {
    return axios.get('/tokens/refresh', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('refreshToken')
        },
        skipAuthRefresh: true // Prevent infinite loops
    })
        .then(function(response) {
            const newAccessToken = response.data.token; // Match your API response
            localStorage.setItem('accessToken', newAccessToken);
            return newAccessToken;
        });
}

// Response interceptor
axios.interceptors.response.use(
    function(response) {
        return response;
    },
    function(error) {
        if (error.response && error.response.status === 401 && !error.config.skipAuthRefresh) {
            return refreshToken()
                .then(function(newToken) {
                    error.config.headers.Authorization = 'Bearer ' + newToken;
                    return axios.request(error.config);
                })
                .catch(function(refreshError) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/signin';
                    return Promise.reject(refreshError);
                });
        }
        return Promise.reject(error);
    }
);

axios.interceptors.request.use(function(config) {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
});

export default axios;
