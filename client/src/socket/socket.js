import { io } from 'socket.io-client'

let socket = null

export const connectSocket = (getToken) => {
    if(socket && socket.connected){
        return socket
    }

    socket = io(import.meta.env.VITE_BASE_URL, {
        auth: (cb) => {
            getToken().then((token) => cb({ token }))
        }
    })

    return socket
}

export const disconnectSocket = () => {
    if(socket){
        socket.disconnect()
        socket = null
    }
}

export const getSocket = () => {
    if(!socket){
        throw new Error('Socket not initialized. Ensure connectSocket() has been called before using getSocket().')
    }
    return socket
}