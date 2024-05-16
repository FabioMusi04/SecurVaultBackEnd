import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectToDatabase } from './Db/db.js';


const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({
    origin: process.env.CORS_ORIGIN,
}));

connectToDatabase().catch((error) => {
    console.error(error);
});

import auth from './Auth/auth.js';

import user from './Api/user.js';
import password from './Api/password.js';

app.use('/auth', auth);
app.use('/user', user);
app.use('/password', password);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
