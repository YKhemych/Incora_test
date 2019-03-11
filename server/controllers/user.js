const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models').User;
const keys = require('../config/keys');


module.exports.getLoginPage = function(req, res){
    res.render('login', {message: ''});
}

module.exports.login = async function(req, res) {
    // console.log(req.body)
    const candidate = await User.findOne({where: {email: req.body.email} });
    if (candidate){
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.dataValues.password);
        if (passwordResult){
            const token = jwt.sign({
                email: candidate.dataValues.email,
                userId: candidate.dataValues.id
            }, keys.jwt, {expiresIn: 60 * 60});
            res.status(200).render('login', { message: 'Bearer ' + token})
        } else {
            //error
            res.status(401).render('login', { message: 'Wrong password.'})
        }
    } else {
        res.status(404).render('login', { message: 'User not found'})
    }
};

module.exports.getRegisterPage = function(req, res){
    res.render('register', {message: ''});
}

module.exports.register = async function (req, res) {
    const candidate = await User.findOne({where: {email: req.body.email} });
    if (candidate){
        res.status(409).render('register', {message: 'Such email already exists. Try another one.'})
    }else {
        const salt = bcrypt.genSaltSync(10);
        const password = req.body.password;
        try {
            await User.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phone: req.body.phone,
                password: bcrypt.hashSync(password, salt)
            }).then(user => res.status(201).render('register', {message: "User was created"}))
                .catch(error => res.status(404).render('register', {message: `Validation error ${error}`}))
        }catch (e) {
            res.status(500).render('register', {message: error.message ? error.message : error})
        }
    }
};


module.exports.getById = async function (req, res) {
    try {
        const candidate = await User.findById(req.params.id);
        if (candidate){
            res.status(200).render('oneUser', { user: candidate.dataValues, message: ''})
        } else {
            res.status(404).json({
                message: 'User not found'
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message ? error.message : error
        })
    }
};

module.exports.updateSchema = function(socket_io){
    socket_io.emit('data', {message: "Connected"});

    socket_io.on('response', async function (data) {
        console.log(data);
        const candidate = await User.findById(data.id);
        if (candidate){
            const password = data.password;
            let pass;
            if (password){
                const salt = bcrypt.genSaltSync(10);
                pass = bcrypt.hashSync(password, salt);
            }
            try {
                await User.update({
                    firstName: data.firstName || candidate.dataValues.firstName,
                    lastName: data.lastName || candidate.dataValues.lastName,
                    email: data.email || candidate.dataValues.email,
                    phone: data.phone || candidate.dataValues.phone,
                    password: pass || candidate.dataValues.password
                }, { where: { id: data.id } }).then(() => socket_io.emit('success', {message: "Update successful"}))
                    .catch(error => socket_io.emit('success', {message: `Validation error ${error}`}))
            }catch (e) {
                res.status(500).json({
                    success: false,
                    message: error.message ? error.message : error
                })
            }
        } else {
            socket_io.emit('success', {message: 'User not found'});
        }
    });
}