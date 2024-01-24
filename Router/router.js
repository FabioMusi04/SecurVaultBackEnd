import express from 'express';
import utils from '../Utils/utils.js';
const router = express.Router();

router.get('/',  utils.AuthMidVerifyToken  ,(req, res) => {
    res.send('Hello, World!');
});

router.get('/login', (req, res) => {
    res.send('Login page');
});

router.get('/register', (req, res) => {
    res.send('Register page');
});

export default router;