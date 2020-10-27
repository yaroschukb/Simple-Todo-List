const {Router} = require('express');
const {check, validationResult} = require('express-validator');
const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');
const router = Router();


router.post('/register',
    [
        check('email', 'Wrong email or password!').isEmail(),
        check('password', 'Min length 6 symbols!').isLength({
            min: 6
        })
    ],
    async (req, res) => {
        try {          

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Wrong data!'
                })
            }
            const { email, password } = req.body;
            const candidate = await User.findOne({email});
            if (candidate) {
                /* res.status(400).json({
                    message: 'User exist'
                }); */
                return res.redirect('/login');
                
            }
            
            const hashedPassword = await bcrypt.hash(password, 11);
            const user = new User({
                email: email,
                password: hashedPassword
            });
            await user.save();
            res.redirect('/create')
            //res.status(201).json('User created');

        } catch (e) {
            res.status(500).json({
                message: 'Something wrong try again!'
            });

        }
    })

//api/auth/login
router.post('/login',
    [
        check('email', 'Check your email!').normalizeEmail().isEmail(),
        check('password', 'Check password!').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect login information!'
                })
            }
            const {email, password} = req.body;
            
            const user = await User.findOne({email});
            
            if (!user){
                return res.status(400).json({message: 'Undefined login'});
            }
            
            const isMatch = await bcrypt.compare(password, user.password);
            
            if(!isMatch){
                return res.status(400).json({message:'Wrong email or password!'});
            }

            const token = jwt.sign(
                {userId: user._id},
                config.get('jwtSecret'),
                {expiresIn: '1h'}
            )
            
            res.json(token, {userId: user.id});   
            res.redirect('/home/:id');

        } catch (e) {
            res.status(500).json({
                message: 'Something wrong try again!'
            });
        }
    })

module.exports = router;