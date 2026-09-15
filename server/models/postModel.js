import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user: { type: String, ref: 'userModel', required: true },
    content: { type: String },
    image_urls: [ { type: String } ],
    post_type: { type: String, enum: ['text', 'image', 'text-with-image'], required: true },
    likes_count: [{ type: String, ref: 'userModel' }],
    comments_count: { type: Number, default: 0 },
}, {timestamps: true, minimize: false})

const Post = mongoose.model('postModel', postSchema)

export default Post