import axios from "axios";

const mAxios = axios.create({
    baseURL: "https://atomowki.azurewebsites.net/api",
    responseType: "json"
});

mAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        config.headers['Authorization'] = token;
        return config;
    },
    (error) => Promise.reject(error));

mAxios.interceptors.response.use(
    (response) => response, 
    (error) => {
        if (error.response.status === 403) {
            localStorage.removeItem('token')
            window.location = "https://atomowki.azurewebsites.net/"
        }
    });

export default mAxios;
