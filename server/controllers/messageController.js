import fs from 'fs'
import imagekit from '../configs/imagekit.js';
import Message from '../models/messageModel.js';

export const uploadChatImage = async (req, res) => {
    try {
        const image = req.file
        if(!image) return res.json({success: false, message: "No image provided"})
        const fileBuffer = fs.readFileSync(image.path)
        const response = await imagekit.upload({ file: fileBuffer, fileName: image.originalname })
        const media_url = imagekit.url({
            path: response.filePath,
            transformation: [{quality: 'auto'}, {format: 'webp'}, {width: '1280'}]
        })
        res.json({success: true, media_url})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

export const getUserRecentMessages = async(req,res)=>{

    try {

        const { userId } = req.auth()
        const messages = await Message.find({to_user_id: userId}).populate('from_user_id  to_user_id').sort({created_at: -1})

        res.json({success: true, messages})
        
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }

}