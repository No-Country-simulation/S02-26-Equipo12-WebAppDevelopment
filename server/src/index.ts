import express from 'express'
import cors from 'cors'

import { sequelize } from './config/db'
import { errorHandler } from './middleware/errorHandler'

import { AppRoutes } from './routes/app.routes'
import { setupSwagger } from './config/swagger.config'

const PORT = process.env.PORT || 3000
const app = express()

app.use(cors())
app.use(express.json())

const routes = AppRoutes.routes

setupSwagger(app)

app.use('/api/v1/', routes)

const main = async () => {
  try {
    await sequelize.sync({ alter: true })
    console.log('Database synced')
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Error starting server:', error)
  }
}

app.use(errorHandler)

main()
