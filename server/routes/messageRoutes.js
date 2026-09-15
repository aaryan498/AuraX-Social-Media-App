import express from 'express'
import { uploadChatImage } from '../controllers/messageController.js'
import { upload } from '../configs/multer.js'
import { protect } from '../middlewares/auth.js'

const messageRouter = express.Router()

messageRouter.post('/upload-image', upload.single('image'), protect, uploadChatImage)

export default messageRouter;