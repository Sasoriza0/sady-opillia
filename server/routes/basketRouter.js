const Router = require('express')
const router = Router()
const { getBasket, verifyBasket, createBasket, addGoodsToBasket, updateGoodsQuantityInBasket, removeGoodsFromBasket, removeBasket } = require('../controllers/basketController.js')
const verifyBasketMiddleware = require('../middleware/verifyBasketMiddleware.js')

router.get('/view', verifyBasketMiddleware, getBasket)
router.get('/verify', verifyBasketMiddleware, verifyBasket)
router.post('/create', createBasket)
router.patch('/add/:id', verifyBasketMiddleware, addGoodsToBasket)
router.patch('/update/:id', verifyBasketMiddleware, updateGoodsQuantityInBasket)
router.patch('/removeGoods/:id', verifyBasketMiddleware, removeGoodsFromBasket)
router.delete('/remove', verifyBasketMiddleware, removeBasket)

module.exports = router