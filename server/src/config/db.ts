import {Sequelize} from 'sequelize-typescript'
import dotenv from 'dotenv'
import { Brand } from '../models/brandModels'


dotenv.config()

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  models: [Brand]
});