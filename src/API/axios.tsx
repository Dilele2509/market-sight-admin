import axios from 'axios';

const BASE_URL = `http://${import.meta.env.VITE_SERVER_HOST}:${import.meta.env.VITE_SERVER_PORT}/api/`;


const AUTH_URL = `http://${import.meta.env.VITE_SERVER_HOST}:${import.meta.env.VITE_AUTH_PORT}/api/`;

export default axios.create({
    baseURL: BASE_URL,
});

export const axiosAuth = axios.create({
    baseURL: AUTH_URL,
    headers: {'Content-Type': 'application/json'},
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: {'Content-Type': 'application/json'},
    withCredentials:true
});

export function testURL (){
    console.log(import.meta.env);
    console.log(AUTH_URL);
}