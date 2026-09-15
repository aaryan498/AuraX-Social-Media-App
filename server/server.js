import express from 'express'
import cors from 'cors'
import 'dotenv/config';
import http from 'http'
import connectDB from './configs/db.js';
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import { clerkMiddleware } from '@clerk/express'
import userRouter from './routes/userRoutes.js';
import postRouter from './routes/postRoutes.js';
import storyRouter from './routes/storyRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { initSocket } from './socket/index.js'

const app = express()
const httpServer = http.createServer(app)
await connectDB()

if(!process.env.TURN_URL || !process.env.TURN_USERNAME || !process.env.TURN_CREDENTIAL){
    console.log("⚠️  WARNING: TURN_URL/TURN_USERNAME/TURN_CREDENTIAL are not fully set. Calls will be unreliable across restrictive networks without a TURN server.")
}

app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())




app.get('/', (req, res)=>{
    res.send("API WORKING")
})
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use('/api/user', userRouter)
app.use('/api/post', postRouter)
app.use('/api/story', storyRouter)
app.use('/api/message', messageRouter)

initSocket(httpServer)

const port = process.env.PORT || 4000;

httpServer.listen(port, ()=>console.log(`Server running on Port: ${port}`))