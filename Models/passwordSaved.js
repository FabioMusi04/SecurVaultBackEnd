import mongoose from 'mongoose';
const Schema = mongoose.Schema

const PasswordSaved = new Schema({
    website: {
        type: String,
        required: true,
    },
    username: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/5582/5582931.png",
    },
    salt: {
        type: String,
    },
    salt_rounds: {
        type: Number,
        default: 10,
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

export default mongoose.model('PasswordSaved', PasswordSaved);