import express from 'express';
const Router = express.Router();
import PasswordSaved from '../Models/passwordSaved.js';
import { verifyToken } from '../Auth/jwt.js';
import User from '../Models/user.js';
import { encrypt, decrypt, deriveKey } from '../Cryptation/crypt.js';

// Middleware for error handling
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
};

Router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('passwords_saved');
        if(!user) return res.status(404).json({ error: 'User not found' });
        
        const userKey = await deriveKey(user.password, user.salt);
        if(!userKey) return res.status(500).json({ error: 'Internal Server Error while deriving key' });
        

        const passwords = user.passwords_saved.map(item => {
            const decryptedPass = decrypt(item.password, userKey);
            console.log(decryptedPass)
            return { ...item._doc, password: decryptedPass };
        });

        res.status(200).json(passwords);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add password saved
Router.post('/add', verifyToken, async (req, res) => {
    try {
        const { website, username, email, password } = req.body;
        const icon = "https://cdn-icons-png.flaticon.com/512/5582/5582931.png";
        if (!email && !username) return res.status(400).json({ error: 'Email or username is required' });
        if (email && username) return res.status(400).json({ error: 'Email or username can be used' });
        if (email && !validateEmail(email)) return res.status(400).json({ error: 'Invalid email' });

        const user = await User.findById(req.userId);
        if(!user) return res.status(404).json({ error: 'User not found' });
        
        const userKey = await deriveKey(user.password, user.salt);
        if(!userKey) return res.status(500).json({ error: 'Internal Server Error while deriving key' });

        const cryptedpass = encrypt(password, userKey);

        let newPassword = null;
        if (email && !username) {
            newPassword = new PasswordSaved({
                website: website,
                email: email,
                password: cryptedpass,
                icon: icon,
            });
        } 
        if (!email && username) {
            newPassword = new PasswordSaved({
                website: website,
                username: username,
                password: cryptedpass,
                icon: icon,
            });
        }
        if(!newPassword) return res.status(400).json({ error: 'Invalid request' });
        const savedPassword = await newPassword.save();
        const updatedUser = await User.findByIdAndUpdate(
            req.userId, 
            { $push: { passwords_saved: savedPassword._id } },
            { new: true }
        );
        if(!updatedUser) {
            await PasswordSaved.findOneAndDelete(savedPassword._id);
            return res.status(500).json({ error: 'Internal Server Error while saving on user' });
        }
        savedPassword.password = password
        res.status(201).json({ message: 'Password saved successfully', password: savedPassword});
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update password saved
Router.put('/update/:id', verifyToken, async (req, res) => {
    try {
        const { website, username, email, password } = req.body;
        const updatedPassword = await PasswordSaved.findByIdAndUpdate(req.params.id, {
            website,
            username,
            email,
            password,
            icon,
            updated_at: Date.now()
        }, { new: true });
        res.status(200).json({ message: 'Password updated successfully', password: updatedPassword });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Remove password saved
Router.delete('/remove/:id', verifyToken, async (req, res) => {
    try {
        const removedPassword = await PasswordSaved.findOneAndDelete({ _id: req.params.id });
        if(!removedPassword) return res.status(404).json({ error: 'Password not found' });
        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { $pull: { passwords_saved: req.params.id } },
            { new: true }
        );
        if(!updatedUser){
            await removedPassword.save();
            return res.status(500).json({ error: 'Internal Server Error while removing on user' });
        }
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