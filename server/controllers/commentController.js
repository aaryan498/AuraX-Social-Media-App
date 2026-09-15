import Comment from '../models/commentModel.js'
import Post from '../models/postModel.js'
import { getIO } from '../socket/index.js'

export const addComment = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { postId, text } = req.body

        if(!text || !text.trim()){
            return res.json({success: false, message: "Comment text is required"})
        }

        const post = await Post.findById(postId)
        if(!post){
            return res.json({success: false, message: "Post not found"})
        }

        const comment = await Comment.create({ post: postId, user: userId, text })
        const updatedPost = await Post.findByIdAndUpdate(postId, { $inc: { comments_count: 1 } }, { new: true })
        const populatedComment = await Comment.findById(comment._id).populate('user')

        getIO().to(`post:${postId}`).emit('comment:new', {
            postId,
            comment: populatedComment,
            comments_count: updatedPost.comments_count
        })

        res.json({success: true, comment: populatedComment})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

export const getPostComments = async (req, res) => {
    try {
        const { postId } = req.params
        const comments = await Comment.find({post: postId}).populate('user').sort({createdAt: 1})
        res.json({success: true, comments})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

export const deleteComment = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { commentId } = req.body

        const comment = await Comment.findById(commentId)
        if(!comment){
            return res.json({success: false, message: "Comment not found"})
        }
        if(comment.user !== userId){
            return res.json({success: false, message: "You can only delete your own comments"})
        }

        const postId = comment.post
        await Comment.findByIdAndDelete(commentId)
        const updatedPost = await Post.findByIdAndUpdate(postId, { $inc: { comments_count: -1 } }, { new: true })

        getIO().to(`post:${postId}`).emit('comment:deleted', {
            postId: postId.toString(),
            commentId,
            comments_count: updatedPost.comments_count
        })

        res.json({success: true, message: "Comment deleted successfully"})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}