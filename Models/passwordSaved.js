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
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

export default mongoose.model('PasswordSaved', PasswordSaved);