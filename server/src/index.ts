import express from 'express'
import { sequelize } from './config/db'

const app = express()
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

main();