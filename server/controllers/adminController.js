const { Admin } = require('../models/models.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const ApiError = require('../error/ApiError.js')

/**
 * @route /api/admin/login
 * @desc login
 * @access private
*/
const login = async (req, res, next) => {
    try {
        const admin = await Admin.findOne({name: req.body.name})
        if (!admin) {
            return next(ApiError.badRequest('Некоректне ім\'я або пароль'))
        }

        const {password} = req.body
        const isPasswordCorrect = await bcrypt.compare(password, admin._doc.passwordHash)
        if (!isPasswordCorrect) {
            return next(ApiError.badRequest('Некоректне ім\'я або пароль'))
        }
 
        const adminToken = jwt.sign(
            {_id: admin._id}, 
            process.env.SECRET_KEY, 
            {expiresIn: '7d'}
        )

        res.json({
            adminToken
        })
    } catch (err) {
        next(ApiError.internal('Непередбачувана помилка'))
    }
}

/**
 * @route /api/admin/auth
 * @desc check authorization and gen new token
 * @access private
*/
const checkAuth = async (req, res, next) => {
    try {
        const adminToken = jwt.sign(
            {_id: req.admin._id}, 
            process.env.SECRET_KEY, 
            {expiresIn: '7d'}
        )
        res.json({
            adminToken
        })
    } catch (err) {
        next(ApiError.internal('Непередбачувана помилка'))
    }
}

module.exports = {
    login,
    checkAuth
}