const Router = require('express')
const router = Router()
const { goodsValidator } = require('../validation/validation.js')
const checkValidation = require('../middleware/checkValidationMiddleware.js')
const checkAuth = require('../middleware/checkAuthMiddleware.js')
const { add, getAll, getById, getByFruitType, update, remove } = require('../controllers/goodsController.js')

router.post('/add', goodsValidator,  checkAuth, add)
router.get('/view', getAll)
router.get('/view/:id', getById)
router.get('/fruit/:type', getByFruitType)
router.put('/update/:id', goodsValidator, checkValidation, checkAuth, update)
router.delete('/remove/:id', checkAuth, remove)

module.exports = router