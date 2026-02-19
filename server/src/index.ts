import express from 'express'

import { AppRoutes } from './routes/app.routes'

import { setupSwagger } from './config/swagger.config'

const PORT = 3000

const routes = AppRoutes.routes

const app = express()
app.use(express.json())

setupSwagger(app)

app.use('/api/v1/', routes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})