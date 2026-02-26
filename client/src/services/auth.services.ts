import { axiosInstance } from "./axios.instance"

export const loginUser = async (email: string, password: string) =>{
    const response = await axiosInstance.post("/auth/login", {email, password})
    return response.data
}