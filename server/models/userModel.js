import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    email: {type: String, required: true},
    full_name: {type: String, required: true},
    username: {type: String, unique: true},
    bio: {type: String, default: "Hey There! I am using VanillaOne"},
    profile_picture: {type: String, default: ''},
    cover_photo: {type: String, default: ''},
    location: {type: String, default: ''},
    followers: [{type: String, ref: 'userModel', default: []}],
    following: [{type: String, ref: 'userModel', default: []}],
    connections: [{type: String, ref: 'userModel', default: []}],
}, {timestamps: true, minimize: false})

const User = mongoose.model('userModel', userSchema)

export default User;