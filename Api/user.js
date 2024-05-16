import express from 'express';
const Router = express.Router();
import User from '../Models/user.js';
import { verifyToken } from '../Auth/jwt.js';

// Middleware for error handling
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
};

// Get user info
Router.get('/info', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Edit user info
Router.put('/update', verifyToken, async (req, res) => {
    if(!req.body.username && !req.body.email && !req.body.bio && !req.body.profile_image_url) {
        return res.status(400).json({ message: 'No data provided' });
    }
    const userData = {
        username: req.body.username || req.user.username,
        email: req.body.email || req.user.email,
        bio: req.body.bio || req.user.bio || "",
        profile_image_url: req.body.profile_image_url || req.user.profile_image_url
    };
    try {
        await User.findOneAndUpdate({ _id: req.user._id }, userData);
        return res.status(200).json({ message: 'User updated' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Handle 404 Not Found
Router.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Error handling middleware
Router.use(errorHandler);

export default Router;
