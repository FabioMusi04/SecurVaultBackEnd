import mongoose from 'mongoose';

const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    salt: { type: String, required: true },
    saltRounds: { type: Number, default: 10 },
    email: { type: String, required: true, unique: true },
    profile_image_url: { type: String, default: 'https://placehold.co/600x400' },
    registered_at: { type: Date, default: Date.now },
    passwords_saved: [{ type: Schema.Types.ObjectId, ref: 'PasswordSaved' }], // Reference to PasswordSaved schema
});

const User = mongoose.model('User', UserSchema);

export default User;
