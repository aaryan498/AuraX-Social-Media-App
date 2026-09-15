import mongoose from "mongoose";

const callSchema = new mongoose.Schema({
    caller: { type: String, ref: 'userModel', required: true },
    receiver: { type: String, ref: 'userModel', required: true },
    call_type: { type: String, enum: ['audio', 'video'], required: true },
    status: { type: String, enum: ['missed', 'completed', 'rejected'], required: true },
    started_at: { type: Date },
    ended_at: { type: Date },
}, {timestamps: true, minimize: false})

const Call = mongoose.model('callModel', callSchema)

export default Call;