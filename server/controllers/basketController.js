const { Basket, Goods } = require('../models/models.js')
const ApiError = require('../error/ApiError.js')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

/**
 * @route /api/basket/create
 * @desc create new basket
 * @access public
*/
const createBasket = async (req, res, next) => {
    try {
        const doc = new Basket({
            goods: [],
            totalPrice: 0
        })

        const basket = await doc.save()

        const token = jwt.sign(
            {_id: basket._id}, 
            process.env.SECRET_KEY, 
            {expiresIn: '30d'}
        )

        res.json({
            token,
            basket
        })
    } catch (err) {
        console.log(err)
        next(ApiError.internal('Непередбачувана помилка'))
    }
}

/**
 * @route /api/basket/view
 * @desc get basket
 * @access public
*/
const getBasket = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.basket._id)) {
            return next(ApiError.badRequest('ID некоректне'))
        }
    
        const basket = await Basket.findById(req.basket._id)

        res.json({
            basket
        })
    } catch (err) {
        console.log(err)
        next(ApiError.internal('Непередбачувана помилка'))
    }
}

/**
 * @route /api/basket/verify
 * @desc verify basket
 * @access public
*/
const verifyBasket = async (req, res, next) => {
    try {
        const {basket} = req

        const token = jwt.sign(
            {_id: basket._id}, 
            process.env.SECRET_KEY, 
            {expiresIn: '30d'}
        )

        res.json({
            token
        })
    } catch (err) {
        console.log(err)
        next(ApiError.internal('Непередбачувана помилка'))
    }
}

/**
 * @route /api/basket/add
 * @desc add goods to basket
 * @access public
*/
const addGoodsToBasket = async (req, res, next) => {
    try {
        const {id} = req.params    

        if (!mongoose.isValidObjectId(req.basket._id) || !mongoose.isValidObjectId(id)) {
            return next(ApiError.badRequest('ID корзини або товару некоректне'))
        }

        const basket = await Basket.findById(req.basket._id)

        const goods = await Goods.findById(id)
        if (!goods) {
            return next(ApiError.notFound('Товар не знайдено'));
        }

        const itemIndex = basket.goods.findIndex(g => g.item._id.toString() === id.toString())
        if (itemIndex > -1) {
            return res.status(409).json({
                message: 'Цей товар вже додано в корзину',
                basket
            })
        } else if (goods.count < 1) {
            return res.status(404).json({
                message: 'Товару немає в наявності'
            })
        }

        basket.goods.push({item: goods.toObject(), count: 1})

        basket.totalPrice += goods.price

        const updatedBasket = await basket.save()

        res.json({
            updatedBasket
        })
    } catch (err) {
        console.log(err)
        next(ApiError.internal('Непередбачувана помилка'))
    }
}

/**
 * @route /api/basket/removeGoods/:id
 * @desc remove goods from basket
 * @access public
*/
const removeGoodsFromBasket = async (req, res, next) => {
    try {
        const {id} = req.params    

        if (!mongoose.isValidObjectId(req.basket._id) || !mongoose.isValidObjectId(id)) {
            return next(ApiError.badRequest('ID корзини або товару некоректне'))
        }

        const basket = await Basket.findById(req.basket._id)

        const goods = await Goods.findById(id)
        if (!goods) {
            return next(ApiError.notFound('Товар не знайдено'))
        }

        const itemIndex = basket.goods.findIndex(g => g.item._id.toString() === id.toString())
        if (itemIndex === -1) {
            return next(ApiError.notFound('Товар не знайдено у кошику'))
        }
        
        const removedItem = basket.goods[itemIndex]
        const removedCount = removedItem.count
        const removedItemTotalPrice = removedCount * goods.price

        basket.totalPrice -= removedItemTotalPrice

        basket.goods.splice(itemIndex, 1)

        const updatedBasket = await basket.save()

        res.json({
            updatedBasket
        })
    } catch (err) {
        console.log(err)
        next(ApiError.internal('Непередбачувана помилка'))
    }
}

/**
 * @route /api/basket/remove/:id
 * @desc update goods quantity in basket
 * @access public
*/
const updateGoodsQuantityInBasket = async (req, res, next) => {
    try {
        const {id} = req.params    
        if (!mongoose.isValidObjectId(req.basket._id) || !mongoose.isValidObjectId(id)) {
            return next(ApiError.badRequest('ID корзини або товару некоректне'))
        }

        const basket = await Basket.findById(req.basket._id)
        const {newCount} = req.body

        const goods = await Goods.findById(id)
        if (!goods) {
            return next(ApiError.notFound('Товар не знайдено'));
        }

        const itemIndex = basket.goods.findIndex(g => g.item._id.toString() === id.toString())
        if (itemIndex === -1) {
            return next(ApiError.notFound('Такого товару не знайдено'))
        }

        if (newCount < 0) {
            return next(ApiError.badRequest('Невірна кількусть товару'))
        }

        const oldCount = basket.goods[itemIndex].count

        if (newCount === 0) {
            basket.goods.splice(itemIndex, 1)
            basket.totalPrice -= goods.price * oldCount
        } else {
            if (newCount > goods.count) {
                return res.status(404).json({
                    message: 'Це максимальна кількість товару в яка є зараз в наявності',
                    basket
                })
            }

            basket.totalPrice += goods.price * (newCount - oldCount)
            basket.goods[itemIndex].count = newCount
        }

        const updatedBasket = await basket.save()

        res.json({
            updatedBasket
        })
    } catch (err) {
        console.log(err)
        next(ApiError.internal('Непередбачувана помилка'))
    }
}

/**
 * @route /api/basket/remove
 * @desc remove basket
 * @access public
*/
const removeBasket = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.basket._id)) {
            return next(ApiError.badRequest('ID корзини або товару некоректне'))
        }

        const basket = await Basket.findById(req.basket._id)
        if (!basket) {
            return next(ApiError.notFound('Корзини не знайдено'))
        }

        await Basket.findByIdAndDelete(req.basket._id)
    
        res.json({
            message: 'Кошик успішео видалено'
        })
    } catch (err) {
        console.log(err)
        next(ApiError.internal('Непередбачувана помилка'))
    }
}

module.exports = {
    createBasket,
    getBasket,
    verifyBasket,
    addGoodsToBasket,
    updateGoodsQuantityInBasket,
    removeGoodsFromBasket,
    removeBasket
}