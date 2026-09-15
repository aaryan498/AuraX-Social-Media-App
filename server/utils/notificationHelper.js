import Notification from '../models/notificationModel.js'
import { emitToUser } from '../socket/index.js'

export const createAndEmitNotification = async ({ recipient, sender, type, post, story, comment }) => {
    if(recipient === sender) return

    const notification = await Notification.create({ recipient, sender, type, post, story, comment })
    const populatedNotification = await Notification.findById(notification._id).populate('sender')

    emitToUser(recipient, 'notification:new', populatedNotification)

    return populatedNotification
}