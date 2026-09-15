import User from '../models/userModel.js'
import Message from '../models/messageModel.js'

export const registerChatHandlers = (io, socket) => {

    socket.on('message:send', async ({ to_user_id, text, media_url, message_type }, ack) => {
        try {

            const user = await User.findById(socket.userId)

            if(!user.connections.includes(to_user_id)){
                return ack({ success: false, message: "You can only message your connections" })
            }

            const message = await Message.create({
                from_user_id: socket.userId,
                to_user_id,
                text,
                message_type,
                media_url: media_url || ''
            })

            const populatedMessage = await Message.findById(message._id).populate('from_user_id')

            ack({ success: true, message: populatedMessage })

            io.to(to_user_id).to(socket.userId).emit('message:receive', populatedMessage)

        } catch (error) {
            console.log(error)
            ack({ success: false, message: error.message })
        }
    })

    socket.on('message:fetch', async ({ to_user_id }, ack) => {
        try {

            const messages = await Message.find({
                $or: [
                    {from_user_id: socket.userId, to_user_id},
                    {from_user_id: to_user_id, to_user_id: socket.userId},
                ]
            }).sort({created_at: -1})

            const result = await Message.updateMany({from_user_id: to_user_id, to_user_id: socket.userId}, {seen: true})

            ack({ success: true, messages })

            if(result.modifiedCount > 0){
                io.to(to_user_id).emit('message:seen-update', { by: socket.userId, to_user_id: socket.userId })
            }

        } catch (error) {
            console.log(error)
            ack({ success: false, message: error.message })
        }
    })

}