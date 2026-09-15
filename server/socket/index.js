import { Server } from 'socket.io'
import { clerkClient } from '@clerk/express'
import { registerChatHandlers } from './chatHandlers.js'
import { registerCallHandlers } from './callHandlers.js'
import User from '../models/userModel.js'

let io = null
const onlineUsers = new Map()

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

    io.on('connection', async (socket) => {
        socket.join(socket.userId)

        if(!onlineUsers.has(socket.userId)) onlineUsers.set(socket.userId, new Set())
        const wasOffline = onlineUsers.get(socket.userId).size === 0
        onlineUsers.get(socket.userId).add(socket.id)

        const currentUser = await User.findById(socket.userId)
        if(currentUser){
            if(wasOffline){
                currentUser.connections.forEach(id => emitToUser(id, 'presence:update', { userId: socket.userId, status: 'online' }))
            }
            const onlineConnections = currentUser.connections.filter(id => onlineUsers.has(id) && onlineUsers.get(id).size > 0)
            socket.emit('presence:snapshot', { onlineUserIds: onlineConnections })
        }

        console.log('Socket connected:', socket.userId, socket.id)

        socket.on('disconnect', async () => {
            console.log('Socket disconnected:', socket.userId, socket.id)

            const sockets = onlineUsers.get(socket.userId)
            if(sockets){
                sockets.delete(socket.id)
                if(sockets.size === 0){
                    onlineUsers.delete(socket.userId)
                    const user = await User.findById(socket.userId)
                    if(user){
                        user.connections.forEach(id => emitToUser(id, 'presence:update', { userId: socket.userId, status: 'offline' }))
                    }
                }
            }
        })

        registerChatHandlers(io, socket)
        registerCallHandlers(io, socket)

        socket.on('post:join', (postId) => { socket.join(`post:${postId}`) })
        socket.on('post:leave', (postId) => { socket.leave(`post:${postId}`) })
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