import { Horse } from "../models/horseModel"
import { Rider } from "../models/riderModel"

export class HorseService {

  async create(riderId: string, data: { name: string }) {

    if (!data.name || data.name.trim() === "") {
      const error: any = new Error("Horse name is required")
      error.statusCode = 400
      throw error
    }

    const rider = await Rider.findByPk(riderId)
    if (!rider) {
      const error: any = new Error("Rider not found")
      error.statusCode = 404
      throw error
    }

    const horse = await Horse.create({
      name: data.name,
      riderId
    })

    return horse
  }

  async getAllByRider(riderId: string) {

    const rider = await Rider.findByPk(riderId)
    if (!rider) {
      const error: any = new Error("Rider not found")
      error.statusCode = 404
      throw error
    }

    return await Horse.findAll({
      where: { riderId }
    })
  }

  async getById(horseId: string) {

    const horse = await Horse.findByPk(horseId)
    if (!horse) {
      const error: any = new Error("Horse not found")
      error.statusCode = 404
      throw error
    }

    return horse
  }

  async update(horseId: string, data: { name?: string }) {

    const horse = await Horse.findByPk(horseId)
    if (!horse) {
      const error: any = new Error("Horse not found")
      error.statusCode = 404
      throw error
    }

    if (data.name !== undefined && data.name.trim() === "") {
      const error: any = new Error("Horse name cannot be empty")
      error.statusCode = 400
      throw error
    }

    await horse.update(data)
    return horse
  }

  async delete(horseId: string) {

    const horse = await Horse.findByPk(horseId)
    if (!horse) {
      const error: any = new Error("Horse not found")
      error.statusCode = 404
      throw error
    }

    await horse.destroy()
    return { message: "Horse deleted successfully" }
  }
}