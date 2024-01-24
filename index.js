import express from 'express';
const app = express();
const port = 3000;

app.use(express.json());

import router from './Router/router.js';
import auth from './Auth/auth.js';
import api from './API/api.js';

app.use('/', router);
app.use('/auth', auth);
app.use('/api', api);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
