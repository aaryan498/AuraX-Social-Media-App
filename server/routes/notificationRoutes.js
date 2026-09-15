import express from 'express'
import { protect } from '../middlewares/auth.js'
import { getNotifications, markAllNotificationsRead } from '../controllers/notificationController.js'

const notificationRouter = express.Router()

notificationRouter.get('/list', protect, getNotifications)
notificationRouter.post('/mark-all-read', protect, markAllNotificationsRead)

export default notificationRouter;