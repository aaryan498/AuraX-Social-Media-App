import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema({

    from_user_id: { type: String, ref: 'userModel', required: true },
    to_user_id: { type: String, ref: 'userModel', required: true },
    status: { type: String, enum: ['pending', 'accepted'], default: 'pending' },
},{timestamps: true})

const Connection = mongoose.model('connectionModel', connectionSchema)

export default Connection;