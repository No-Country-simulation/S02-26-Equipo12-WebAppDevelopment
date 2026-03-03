import { Rider } from "../models";

export class RiderService {
    async getAll(){
        return await Rider.findAll()
    }

    async getById(id: string){
        const rider = await Rider.findByPk(id)
        if (!rider) throw new Error('Rider not found')

        return rider
    }

    async update(id: string, data: Partial<Rider>){
        const rider = await this.getById(id)

            await rider.update(data)
        return rider
    }

    async delete(id:string){
        const rider = await this.getById(id)
            await rider.destroy()
        return { message: 'Rider deleted successfully'}
    }
}