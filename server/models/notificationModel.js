import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipient: { type: String, ref: 'userModel', required: true, index: true },
    sender: { type: String, ref: 'userModel', required: true },
    type: {
        type: String,
        enum: ['like', 'follow', 'connection_request', 'connection_accepted', 'comment', 'new_post', 'new_story', 'story_view'],
        required: true
    },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'postModel' },
    story: { type: mongoose.Schema.Types.ObjectId, ref: 'storyModel' },
    comment: { type: mongoose.Schema.Types.ObjectId, ref: 'commentModel' },
    read: { type: Boolean, default: false },
}, {timestamps: true, minimize: false})

notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 259200 })

const Notification = mongoose.model('notificationModel', notificationSchema)

export default Notification;