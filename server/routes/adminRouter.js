const Router = require('express')
const router = Router()
const { adminValidator } = require('../validation/validation.js')
const checkValidation = require('../middleware/checkValidationMiddleware.js')
const { login, checkAuth } = require('../controllers/adminController.js')
const checkAuthMiddleware = require('../middleware/checkAuthMiddleware.js')

router.post('/login', adminValidator, checkValidation, login)
router.get('/auth', checkAuthMiddleware, checkAuth)

module.exports = router