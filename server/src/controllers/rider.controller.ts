import { Request, Response, NextFunction } from "express";
import { RiderService } from "../services/rider.services";


export class RiderController {
    private riders = new RiderService()

    getAll = async (_req: Request, res: Response, next: NextFunction)=>{
        try {
            const riders = await this.riders.getAll()
            res.status(200).json({
                riders
            })
        } catch (error) {
            next(error)
        }
    }

    getById = async (req: Request, res: Response, next: NextFunction)=>{
        try {
            const id = req.params['id'] as string
             const rider = await this.riders.getById(id)
            res.status(200).json({
                rider
            })
        } catch (error) {
            next(error)
        }
    }

    update = async (req: Request, res: Response, next: NextFunction)=>{
        try {
            const id = req.params['id'] as string
            const rider = await this.riders.update(id, req.body)
            res.status(200).json({
                message: 'Rider updated successfully', rider
            })
        } catch (error) {
            next(error)
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction)=>{
        try {
            const id = req.params['id'] as string
            await this.riders.delete(id)
            res.status(200).json({
                message:'Rider deleted successfully'
            })
        } catch (error) {
            next(error)
        }
    }
}