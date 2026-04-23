const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    lastName: {type: String},
    firstName: {type: String},
    midleName: {type: String},
    email: {type: String, required: true, unique: true},
    phone: {type: String},
    passwordHash: {type: String},
}, {timestamps: true})

const otpSchema = new Schema({
    email: { type: String, required: true },
    otp: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now, expires: '5m' }, 
})

const BasketSchema = new Schema({
    goods: [
        {
            _id: false,
            item: {type: Schema.Types.Mixed, required: true,},
            count: {type: Number, required: true, min: 1}
        }
    ],
    totalPrice: {type: Number, required: true, min: 0}
}, {timestamps: true})

const GoodsSchema = new Schema({
    name: {type: String, required: true},
    sort: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    fruitType: {type: String, required: true},
    count: {type: Number, required: true},
    isInStok: {type: Boolean, required: true, default: true},
    image: String
}, {timestamps: true})

const OrderSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    midleName: {type: String, required: true},  
    email: {type: String, required: true},
    phone: {type: String, required: true},
    address: [],
    goods: [
        {
            _id: false,
            item: {type: Schema.Types.Mixed, required: true,},
            count: {type: Number, required: true, min: 1 }
        }
    ],
    paymentMethod: {type: String, required: true},
    totalPrice: {type: Number, required: true, min: 0},
    status: {
        type: String,
        enum: ['new', 'processing', 'sent', 'completed', 'canceled'],
        default: 'new'
    }
}, {timestamps: true})

const AdminSchema = new Schema({
    name: {type: String, required: true},
    passwordHash: {type: String, required: true, unique: true}
}, {timestamps: true})


const User = model('user', userSchema)
const OTP = model('OTP', otpSchema)
const Basket = model('basket', BasketSchema)
const Goods = model('goods', GoodsSchema)
const Order = model('order', OrderSchema)
const Admin = model('admin', AdminSchema)

module.exports = {
    User,
    OTP,
    Basket,
    Goods,
    Order,
    Admin
}