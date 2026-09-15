import Notification from '../models/notificationModel.js'

export const getNotifications = async (req, res) => {
    try {
        const { userId } = req.auth()
        const notifications = await Notification.find({ recipient: userId }).populate('sender').sort({ createdAt: -1 }).limit(100)
        res.json({success: true, notifications})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

export const markAllNotificationsRead = async (req, res) => {
    try {
        const { userId } = req.auth()
        await Notification.updateMany({ recipient: userId, read: false }, { read: true })
        res.json({success: true})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}