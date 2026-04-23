const { Order, Basket, Goods } = require('../models/models.js')
const ApiError = require('../error/ApiError.js')
const mongoose = require('mongoose')

/**
 * @route /api/order/get
 * @desc get all order
 * @access private
*/
const getAllOrder = async (req, res, next) => {
    try {
        let orders = await Order.find().sort({ createdAt: 1 })
        console.log('Orders sorted by createdAt:', orders.map(o => o.createdAt));

        if (orders.length < 1) {
            return res.json({
                message: 'Замовлень немає'
            })
        }
        
        res.json({
            orders
        })
    } catch (err) {
        console.log(err)
        next(ApiError.internal('Непередбачувана помилка'))
    }
}

/**
 * @route /api/order/create
 * @desc create order
 * @access public
*/
const createOrder = async (req, res, next) => {
    try {
        const basketId = req.basket._id

        if (!mongoose.isValidObjectId(basketId)) {
            return next(ApiError.badRequest('ID некоректне'))
        }


        const basket = await Basket.findById(basketId)
        if (!basket) {
            return next(ApiError.badRequest('Корзини не знайдено'))
        }
        console.log(req.body);


        const doc = new Order({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            midleName: req.body.midleName,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address,
            paymentMethod: req.body.paymentMethod,
            goods: req.body.goods,
            totalPrice: req.body.totalPrice
        })

        const order = await doc.save()

        basket.goods = []
        basket.totalPrice = 0
        await basket.save()

        res.json({
            order,
            basket 
        })
    } catch (err) {
        console.error(err)
        next(ApiError.internal('Непередбачувана помилка'))
    }
}

/**
 * @route /api/order/updete
 * @desc updete order
 * @access private
*/
const updateOrder = async (req, res, next) => {
    try {
        const {id} = req.params
        if (!mongoose.isValidObjectId(id)) {
            return next(ApiError.badRequest('ID некоректне'))
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            {status: req.body.status},
            {new: true}
        ) 

        if (!updatedOrder) {
            return next(ApiError.notFound('Замовлення не знайдено'))
        }

        res.json({
            updatedOrder
        })
    } catch (err) {
        console.log(err)
        next(ApiError.internal('Непередбачувана помилка'))
    }
}

module.exports = {
    createOrder,
    getAllOrder,
    updateOrder
}