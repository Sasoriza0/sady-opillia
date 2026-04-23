const Router = require('express')
const router = Router()
const adminRouter = require('./adminRouter.js')
const goodsRouter = require('./goodsRouter.js')
const basketRouter = require('./basketRouter.js')
const orderRouter = require('./orderRouter.js')
const userRouter = require('./userRouter.js')

router.use('/admin', adminRouter)
router.use('/goods', goodsRouter)
router.use('/basket', basketRouter)
router.use('/order', orderRouter)
router.use('/user', userRouter)

module.exports = router