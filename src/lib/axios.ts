import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const axiosPrivate = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
}) 