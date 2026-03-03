import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useBoundStore } from '../../context'

interface TokenPayload {
    id: string
    email: string
    name: string
    lastName: string
    gender: string
}

const getCookie = (name: string)=>{
    const parts = `; ${document.cookie}`.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift()
}

export const AuthProvider = ()=>{
    const login = useBoundStore((state)=> state.login)
    const logout = useBoundStore((state)=> state.logout)

    useEffect(()=>{
        const token = getCookie('token')

        if(!token){
            logout()
            return
        }

        try {
            const decoded = jwtDecode<TokenPayload>(token)
            login({
                id: decoded.id,
                email: decoded.email,
                name: decoded.name,
                lastname: decoded.lastName,
                gender: decoded.gender,

            })
        } catch (error) {
            logout()
        }
},[])
    return null
}