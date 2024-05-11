import express from 'express';
import { verifyToken } from '../Auth/jwt.js';
const router = express.Router();

router.get('/', verifyToken, (req, res) => {
    res.send('Hello, World!');
});

router.get('/login', (req, res) => {
    res.send('Login page');
});

router.get('/register', (req, res) => {
    res.send('Register page');
});

export default router;