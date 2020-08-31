import axios from "axios";

const mAxios = axios.create({
    baseURL: "localhost:4000/",
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
        if (error.response.status === 403) {
            localStorage.removeItem('token');
            window.location = "http://localhost:3000/";
        }
    });

export default mAxios;
