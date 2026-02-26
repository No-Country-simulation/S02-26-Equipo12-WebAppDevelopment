import { Request, Response, NextFunction }  from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
    private authService = new AuthService()

    register = async (req: Request, res: Response, next: NextFunction) =>{
        try {
            const {name, lastName, email, password, birthDate, gender} = req.body
            const rider = await this.authService.register(name, lastName, email, password, birthDate, gender)

            res.status(201).json({
                message: 'Rider registered successfully',
                rider
            })
        } catch (error) {
            next(error)
        }
    }

    login = async (req: Request, res: Response, next: NextFunction)=> {
        try {
            const {email, password} = req.body
            const result = await this.authService.login(email, password)
            res.status(200).json({
                message: 'login success', result
            })
          

        } catch (error) {
            next(error)
        }
    }
}