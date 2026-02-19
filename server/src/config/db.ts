import {Sequelize} from 'sequelize-typescript'
import dotenv from 'dotenv'
import { Brand } from '../models/brandModel'
import { Category } from '../models/categoryModel';
import { SubCategory } from '../models/subCategoryModel';
import { MeasurementType } from '../models/measurementTypesModel';
import { Product } from '../models/productModel';
import { Rider } from '../models/riderModel';
import { Horse } from '../models/horseModel';
import { CategoryRequirement } from '../models/categoryRequirement';
import { HorseMeasurement } from '../models/horseMeasurement';
import { ProductSizeRange } from '../models/productSizeRange';
import { RiderMeasurement } from '../models/riderMeasurement';


dotenv.config()

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  models: [Brand, Category,SubCategory, MeasurementType, Product, Rider, Horse, CategoryRequirement, HorseMeasurement, ProductSizeRange,RiderMeasurement]
});