import fs from 'fs'
import imagekit from '../configs/imagekit.js';
import Post from '../models/postModel.js';
import User from '../models/userModel.js';
import { getIO, emitToUser } from '../socket/index.js'
import { createAndEmitNotification } from '../utils/notificationHelper.js'

// Add Post
export const addPost = async(req, res)=>{

    try {

        const { userId } = req.auth();
        const { content, post_type } = req.body
        const images = req.files || [];

        let image_urls = []

        if(images.length){
            image_urls = await Promise.all(
                images.map(async(image)=>{
                    const fileBuffer = fs.readFileSync(image.path)
                    const response = await imagekit.upload({
                        file: fileBuffer,
                        fileName: image.originalname,
                        folder: "posts",
                    })

                    const url = imagekit.url({
                        path: response.filePath,
                        transformation: [
                            {quality: 'auto'},
                            {format: 'webp'},
                            {width: '1280'}
                        ]
                    })
                    return url;
                })
            )
        }

        const newPost = await Post.create({
            user: userId,
            content,
            image_urls,
            post_type
        })

        const author = await User.findById(userId)
        const populatedPost = await Post.findById(newPost._id).populate('user')
        const audience = [...new Set([...author.followers, ...author.connections])].filter(id => id !== userId)

        await Promise.all(audience.map(recipientId =>
            createAndEmitNotification({ recipient: recipientId, sender: userId, type: 'new_post', post: newPost._id })
        ))
        audience.forEach(recipientId => emitToUser(recipientId, 'post:new', populatedPost))

        res.json({success: true, message: "Post Created successfully"})
        
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }

}


// Get Posts
export const getFeedPosts = async(req, res)=>{

    try {

        const { userId } = req.auth()
        const user = await User.findById(userId)

        // User Connections and Followings 
        const userIds = [userId, ...user.connections, ...user.following]
        const posts = await Post.find({user: {$in: userIds}}).populate('user').sort({createdAt: -1});

        res.json({success: true, posts})
        
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }

}


// Like Post
export const likePost = async(req, res)=>{

    try {

        const { userId } = req.auth()
        const { postId } = req.body;

        const post = await Post.findById(postId)

        if(post.likes_count.includes(userId)){
            post.likes_count = post.likes_count.filter(user => user !== userId)
            await post.save()
            getIO().to(`post:${postId}`).emit('post:like-updated', { postId, likes_count: post.likes_count })
            res.json({success: true, message: "Post Unliked"})
        } else{
            post.likes_count.push(userId)
            await post.save()
            getIO().to(`post:${postId}`).emit('post:like-updated', { postId, likes_count: post.likes_count })
            await createAndEmitNotification({ recipient: post.user, sender: userId, type: 'like', post: post._id })
            res.json({success: true, message: "Post Liked"})
        }
        
        
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }

}