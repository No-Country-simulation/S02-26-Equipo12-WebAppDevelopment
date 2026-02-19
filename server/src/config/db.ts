import {Sequelize} from 'sequelize-typescript'
import dotenv from 'dotenv'
import { Brand, Category, SubCategory, Horse, HorseMeasurement, MeasurementType,Product, Rider, RiderMeasurement, CategoryRequirement, ProductSizeRange } from '../models/index';


dotenv.config()

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  models: [Brand, Category,SubCategory, MeasurementType, Product, Rider, Horse, CategoryRequirement, HorseMeasurement, ProductSizeRange,RiderMeasurement],

  define:{
    timestamps:true,
    underscored:true
  }

});