const jwt = require('jsonwebtoken')
const ApiError = require('../error/ApiError.js')

module.exports = (req, res, next) => {
    try {
        let token = req.headers.authorization
        if (!token) {
            return next(ApiError.badRequest('Не верифікований'))
        }

        token = token.split(' ')[1]

        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        req.basket = decoded
        next()
    } catch (err) {
        console.log(err)
        next(ApiError.internal('Непередбачувана помилка'))
    }
}