import { Request, Response, NextFunction } from "express"
import { HorseService } from "../services/horse.services"

export class HorseController {
  private horses = new HorseService()

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const riderId = req.params['riderId'] as string
      const horse = await this.horses.create(riderId, req.body)

      res.status(201).json({
        message: 'Horse created successfully',
        horse
      })
    } catch (error) {
      next(error)
    }
  }

  getAllByRider = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const riderId = req.params['riderId'] as string
      const horses = await this.horses.getAllByRider(riderId)

      res.status(200).json({
        horses
      })
    } catch (error) {
      next(error)
    }
  }

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const horseId = req.params['horseId'] as string
      const horse = await this.horses.getById(horseId)

      res.status(200).json({
        horse
      })
    } catch (error) {
      next(error)
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const horseId = req.params['horseId'] as string
      const horse = await this.horses.update(horseId, req.body)

      res.status(200).json({
        message: 'Horse updated successfully',
        horse
      })
    } catch (error) {
      next(error)
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const horseId = req.params['horseId'] as string
      await this.horses.delete(horseId)

      res.status(200).json({
        message: 'Horse deleted successfully'
      })
    } catch (error) {
      next(error)
    }
  }
}