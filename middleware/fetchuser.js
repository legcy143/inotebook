// const { ResultWithContext } = require('express-validator/src/chain');
var jwt = require('jsonwebtoken');
const JWT_SECRET = "harryisgoodboy"

const fetchuser = (req, res, next) => {
    // get the user from the jwt token  and id to req object
    const token = req.header('auth-token')
    
    if (!token) {
        res.status(401).send({"error" : "please authenticate using valid token"})
    }

    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.User;
        next()
    } catch (error) {
        res.status(401).send({"error" : "please authenticate using valid token"})
    }
}


module.exports = fetchuser;