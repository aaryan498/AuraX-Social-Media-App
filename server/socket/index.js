import { Server } from 'socket.io'
import { clerkClient } from '@clerk/express'

let io = null

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true
        }
    })

    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token

            if(!token){
                return next(new Error('Authentication required'))
            }

            const payload = await clerkClient.verifyToken(token)
            socket.userId = payload.sub
            next()

        } catch (error) {
            next(new Error('Authentication failed'))
        }
    })

    io.on('connection', (socket) => {
        socket.join(socket.userId)
        console.log('Socket connected:', socket.userId, socket.id)

        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.userId, socket.id)
        })

        // Future phases will register additional handlers here, e.g. registerChatHandlers(io, socket)
    })

    return io
}

export const getIO = () => {
    if(!io){
        throw new Error('Socket.IO not initialized')
    }
    return io
}

export const emitToUser = (userId, event, payload) => {
    getIO().to(userId).emit(event, payload)
}