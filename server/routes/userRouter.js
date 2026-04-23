const Rouetr = require('express')
const router = new Rouetr()
const {register, login, auth, getUserInfo, UserUpdate, forgotPassword, resetPassword, checkOTP} = require('../controllers/userController.js')
const checkAuth = require('../middleware/checkUserAuthMiddleware.js')

router.post('/registration', register)
router.post('/login', login)
router.get('/auth', checkAuth, auth)
router.get('/info', checkAuth, getUserInfo)
router.put('/update', checkAuth, UserUpdate)
router.post('/forgot-password', forgotPassword)
router.post('/checkOTP',  checkOTP)
router.post('/reset-password', resetPassword)



module.exports = router