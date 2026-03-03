import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Rider } from '../models'

export class AuthService {
    async register(name: string, lastName: string,  email: string, password: string, birthDate: Date, gender: 'male' | 'female'){
        const existingRider = await Rider.findOne({ where: { email} })

        if (existingRider) throw new Error('Email already registered')

        const hashedPassword = await bcrypt.hash(password, 10)

        const rider = await Rider.create({
            name,
            lastName,
            email,
            password: hashedPassword,
            birthDate, 
            gender
        })
        return rider
    }
    async login(email: string, password: string){

        const rider = await Rider.findOne({ where: { email}})
        if (!rider) throw new Error('Invalid credentials')

        const isValid = await bcrypt.compare(password, rider.password)
        if (!isValid) throw new Error('Invalid credentials')

        const token = jwt.sign({
            id: rider.id,
            email: rider.email,
            name: rider.name,
            lastName: rider.lastName,
            gender: rider.gender
        }, 
            process.env.JWT_SECRET!, 
            { expiresIn: '24h'}
        )
        return {rider, token}
    }
}