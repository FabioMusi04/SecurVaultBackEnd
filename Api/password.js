import express from 'express';
const Router = express.Router();
import PasswordSaved from '../Models/passwordSaved.js';
import { verifyToken } from '../Auth/jwt.js';

// Middleware for error handling
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
};

Router.get('/passwords', verifyToken, async (req, res) => {
    try {
        const passwords = await PasswordSaved.find({ _id: { $in: req.user.passwords_saved } });
        res.status(200).json(passwords);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add password saved
Router.post('/passwords/add', verifyToken, async (req, res) => {
    try {
        const { website, username, email, password } = req.body;
        const newPassword = new PasswordSaved({
            website,
            username,
            email,
            password
        });
        const savedPassword = await newPassword.save();
        await User.findByIdAndUpdate(req.user._id, { $push: { passwords_saved: savedPassword._id } });
        res.status(201).json({ message: 'Password saved successfully', password: savedPassword });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update password saved
Router.put('/passwords/update/:id', verifyToken, async (req, res) => {
    try {
        const { website, username, email, password } = req.body;
        const updatedPassword = await PasswordSaved.findByIdAndUpdate(req.params.id, {
            website,
            username,
            email,
            password
        }, { new: true });
        res.status(200).json({ message: 'Password updated successfully', password: updatedPassword });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Remove password saved
Router.delete('/passwords/remove/:id', verifyToken, async (req, res) => {
    try {
        await PasswordSaved.findByIdAndRemove(req.params.id);
        await User.findByIdAndUpdate(req.user._id, { $pull: { passwords_saved: req.params.id } });
        res.status(200).json({ message: 'Password removed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Handle 404 Not Found
Router.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Error handling middleware
Router.use(errorHandler);

export default Router;