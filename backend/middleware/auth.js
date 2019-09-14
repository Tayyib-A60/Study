const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'My_Study_Super_Secret_Random_Token');
        const userId = decodedToken.userId;
        if(req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user details provided'
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({
            error: new Error(error.message)
        });
    }
}