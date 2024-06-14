import { generateToken } from './jwt.js';
import bcrypt from 'bcrypt';
import express from 'express';
import User from '../Models/user.js';
import { validateEmail } from '../Models/Validators/email.js';
import { validatePassword } from '../Models/Validators/password.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'email or password is missing' });

        if (!validateEmail(email)) {
            return res.status(400).json({ error: 'Invalid email' });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({ error: 'Invalid password' });
        }
        console.log(await User.findOne ({ email: email }));

        const userInfo = await User.findOne ({ email: email });
        if(!userInfo) return res.status(404).json({ error: 'User not found' });

        const passwordMatch = bcrypt.compareSync(password, userInfo.password);
        if(!passwordMatch) return res.status(401).json({ error: 'Wrong password' });

        const token = generateToken({ id: userInfo.id });
        res.status(200).json({ token: token });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!email || !username || !password) return res.status(400).json({ error: 'email, username or password is missing' });

        if (!validateEmail(email)) {
            return res.status(400).json({ error: 'Invalid email' });
        }
        if (!validatePassword(password)) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        const user = await User.findOne({ email: email });

        if (user) {
            return res.status(409).json({ error: 'User already exists with that email' });
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const result = await User.create({
            email: email,
            username: username,
            password: hash,
            salt: salt,
            saltRounds: 10
        });

        if (!result) {
            return res.status(500).json({ error: 'User not created' });
        }

        const token = generateToken({ id: result.id });
        res.status(200).json({ token: token });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});

export default router;