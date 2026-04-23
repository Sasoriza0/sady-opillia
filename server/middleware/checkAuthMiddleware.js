const jwt = require('jsonwebtoken')
const ApiError = require('../error/ApiError.js')

module.exports = (req, res, next) => {
    if (req.method === "OPTION") {
        return next()
    }

    try {
        let adminToken = req.headers.authorization
        if (!adminToken) {
            return next(ApiError.Unauthorized('Неавторизований'))
        }
        
        adminToken = adminToken.split(' ')[1]

        const decoded = jwt.verify(adminToken, process.env.SECRET_KEY)

        req.admin = decoded
        next()
    } catch (err) {
        console.log(err)
        next(ApiError.internal('Непередбачувана помилка'))
    }
}