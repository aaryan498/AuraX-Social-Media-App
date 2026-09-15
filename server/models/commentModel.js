import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'postModel', required: true },
    user: { type: String, ref: 'userModel', required: true },
    text: { type: String, required: true, trim: true },
}, {timestamps: true, minimize: false})

const Comment = mongoose.model('commentModel', commentSchema)

export default Comment;