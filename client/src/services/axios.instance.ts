import axios from "axios";

const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
}

export const axiosInstance = axios.create({
    baseURL: import.meta.env.PUBLIC_API_URL || "http://localhost:3000/api/v1",
})

axiosInstance.interceptors.request.use((config) =>{
    const token = getCookie('token')
    if (token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})