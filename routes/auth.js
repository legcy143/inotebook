const express = require('express');
var bcrypt = require('bcryptjs');
const User = require('../models/User');
// const { default: mongoose } = require('mongoose');
const router = express.Router()
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = "harryisgoodboy"


// ROUTUE 1
// create account 
// create a user using post method "/api/auth/createuser"
router.post('/createuser', [
    body('name', "enter valid name").isLength({ min: 2 }),
    body('email', "enter valide email").isEmail(),
    body('password', "password lenth is must be 5").isLength({ min: 5 }),
], async (req, res) => { // don't forget to use asyn await

    //// if there are error , return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // checke whether the  user exit with this email alredy
    //// user try catch method for internal server error or any type of error
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ error: "sorry a user with this gmail already exist" })
        }
        /// password  bcrypt js here we bcrypt the password 
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        //// create user 
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })
        ////// adding jwt 
        const data = {
            User: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET)
        res.json({ authtoken })
    }
    // catch error  
    catch (error) {
        console.log(error.message);
        res.status(500).send("some error ocured")
    }
})

//  ROUTE 2 
// // // // // login seteup   \\ \\ \\ \\ \\
// authenticate a user using post method "/api/auth/login"

router.post('/login', [
    body('email', "enter valide email").isEmail(),
    body('password', " password doesnt blanked").exists(),
], async (req, res) => {
    //// if there are error , return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: "plz enter coreect credintial" })
        }

        const passwordCopmpare = await bcrypt.compare(password, user.password)
        if (!passwordCopmpare) {
            return res.status(400).json({ error: "plz enter coreect credintial" })
        }

        const data = {
            User: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET)
        res.json({ authtoken })

    } catch (error) {
        console.log(error.message);
        res.status(500).send("intenal sever occured")
    }

})


// ROUTE 3 
// getting login detail 
// authenticate a user using post method "/api/auth/getuser" _login required
router.post('/getuser',fetchuser ,async (req, res) => {
    try {
        userId =  req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("intenal sever occured in rote 3 get user")
    }
})



module.exports = router