import axios from "axios";

const mAxios = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    responseType: "json"
});

mAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        config.headers['Authorization'] = token;
        return config;
    },
    (error) => Promise.reject(error));

mAxios.interceptors.response.use(
    (response) => response, 
    (error) => {
        if (error.response.status === 401) {
            localStorage.removeItem('token');
            window.location = process.env.REACT_APP_WEBSITE_URL;
        }
    });

export default mAxios;
