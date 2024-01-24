const GetItemById = (Arr, id) => Arr.find(item => item.id === id) || null;
const CheckItemExists = (Arr, id) => Arr.some(item => item.id === id);
const AuthMidVerifyToken = (req, res, next) => { //probably need to be moved?
    const token = req.headers.authorization;
    if(!token){
        return res.redirect('/login');
    }
    jwt.verify(token, 'secret', (err, decoded) => {
        if(err){
            return res.redirect('/login');
        }
        req.UserId = decoded.UserId;
        next();
    });
};

export default {
    GetItemById,
    AuthMidVerifyToken,
    CheckItemExists
};