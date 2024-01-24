import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import express from 'express';

const router = express.Router();

router.post('/login', (req, res) => {
    try{
        const { username, password } = req.body;
        const userInfo = {
            id: 1, //remove this
            username: username,
            password: password
        };
        /* check already in db user */
        const user = userInfo; // change to db variable

        /* if user  do not exists */
        if(!user){ // change to db variable
            return res.status(404).json({ error: 'User not found' });
        }
        /* if user exists */
        const passwordMatch = bcrypt.compareSync(password, user.password);
        if(!passwordMatch){
            return res.status(401).json({ error: 'Wrong password' });
        }
        const token = jwt.sign({UserId: user.id}, 'secret', {expiresIn: '1h'});
        res.status(200).json({ token: token });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.post('/register', (req, res) => {
    try{
        const { username, password } = req.body;
        const userInfo = {
            id: 1, //remove this
            username: username,
            password: password
        };
        /* check already in db user */
        const user = userInfo; // change to db variable

        /* if user exists */
        if(user){ // change to db variable
            return res.status(409).json({ error: 'User already exists' });
        }
        /* if user do not exists */
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const newUser = {
            id: 1, //remove this
            username: username,
            password: hash,
            salt: salt
        };
        /* add user to db */
        res.status(201).json({ message: 'User created'});
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

export default router;