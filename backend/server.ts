import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import imageRouter from './routes/images'
import authRouter from './routes/auth'

dotenv.config({  quiet: true } as any)

const app = express()

app.use(cors({origin: '*'}))
app.use(express.json())
app.use('/auth', authRouter)
app.use('/images', imageRouter)

app.listen(3000, () => {
    console.log('Server running on port 3000.')
})