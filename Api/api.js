/* import express from 'express';
const router = express.Router();

import utils from '../Utils/utils.js';

const items= [
    {
        id: 1,
        name: 'Item 1'
    },
    {
        id: 2,
        name: 'Item 2'
    },
    {
        id: 3,
        name: 'Item 3'
    }
];



router.get('/items', (req, res) => {
    res.status(200).json({
        items: items
    });
});

router.get('/items/:id', utils.AuthMidVerifyToken,  (req, res, next) => {
    const id = parseInt(req.params.id);

    if (!isNaN(id) && utils.CheckItemExists(items, id)) {
        const item = utils.GetItemById(items, id);
        return res.status(200).json({ item });
    }
    next();
});

router.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});


export default router; */