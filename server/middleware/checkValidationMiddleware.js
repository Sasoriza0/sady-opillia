const { validationResult } = require('express-validator')
const ApiError = require('../error/ApiError.js')

module.exports = (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.json(errors.array())
        }
        next()
    } catch (err) {
        next(ApiError.internal('Непередбачувана помилка'))
    }
}