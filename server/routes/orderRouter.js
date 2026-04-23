const Router = require('express')
const router = Router()
const { getAllOrder, createOrder, updateOrder } = require('../controllers/orderController.js')
const verifyBasket = require('../middleware/verifyBasketMiddleware.js')
const { orderValidator } = require('../validation/validation.js')
const checkValidation = require('../middleware/checkValidationMiddleware.js')
const checkAuth = require('../middleware/checkAuthMiddleware.js')

router.get('/view/', checkAuth, getAllOrder)
router.post('/create', verifyBasket, checkValidation, createOrder)
router.patch('/update/:id', checkAuth, updateOrder)

module.exports = router