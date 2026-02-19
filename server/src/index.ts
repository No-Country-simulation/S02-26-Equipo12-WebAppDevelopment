import express from 'express'
import { sequelize } from './config/db'
import { errorHandler } from './middleware/errorHandler'
import cors from 'cors'


const app = express()

app.use(cors())
app.use(express.json())
const PORT = process.env.PORT || 3000

app.get('/', (_req, res) => {
  res.send('Hello')
})

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
main();