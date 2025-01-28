import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/database"
import productRoutes from "./routes/productRoutes"
import { errorHandler } from "./middleware/errorHandler"
import { successLogger } from "./middleware/successLogger"
import Logger from "./utils/logger"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Connect to MongoDB
connectDB()

app.use(express.json())

// Success logger middleware
app.use(successLogger)

// Routes
app.use("/api/products", productRoutes)

// Error handler
app.use(errorHandler)

app.listen(PORT, () => {
  Logger.info(`Server is running on port ${PORT}`)
})

export default app

