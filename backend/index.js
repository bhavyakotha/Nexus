import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import connectDB from './config/connectDB.js'
import userRouter from './route/userRoute.js'
import categoryRouter from './route/categoryRoute.js'
import uploadRouter from './route/uploadRoute.js'

dotenv.config()

const app = express()
app.use(cors({
    credentials : true,
    origin: process.env.FRONTEND_URL
}))

app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))
app.use(helmet({
    crossOriginResourcePolicy: false
}))

const PORT = process.env.PORT || 3000


app.use("/api/user", userRouter)
app.use("/api/category", categoryRouter)
app.use("/api/file", uploadRouter)


app.get("/", (request, response) => {
    response.json({
        message: "Server is running, Bello!"
    })
})


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is run, run, running", PORT)
    })
})

