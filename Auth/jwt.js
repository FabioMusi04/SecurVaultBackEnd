import jwt from 'jsonwebtoken';

export function generateToken(payload) {
    return jwt.sign(payload, process.env.SECRET_KEY, process.env.EXPIRES_IN);
}

export function verifyToken(req, res, next) {
    const authBearer = req.header('Authorization');
    if (!authBearer) return res.status(401).json({ error: 'Access denied' });
    try {
        const token = authBearer.split(' ')[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};