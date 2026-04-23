const { body } = require('express-validator')

const adminValidator = [
    body('name').notEmpty().isString().withMessage('Невірне ім\'я або пароль'),
    body('password').notEmpty().withMessage('Невірне ім\'я або пароль')
]

const goodsValidator = [
    body('name').notEmpty().withMessage('Введіть назву'),
    body('sort').notEmpty().withMessage('Введіть сорт'),
    body('price').notEmpty().isNumeric().withMessage('Введіть ціну'),
    body('description').notEmpty().withMessage('Введіть опис товару'),
    body('fruitType').notEmpty().withMessage('Введіть тип'),
    body('count').notEmpty().isNumeric().withMessage('Введіть кількість товару')
] 

const orderValidator = [
    body('firstName').notEmpty().withMessage('Введіть ім\'я'),
    body('lastName').notEmpty().withMessage('Введіть приізвище'),
    body('midleName').notEmpty().withMessage('Введіть по батькові'),
    body('phone').isMobilePhone().withMessage('Введіть номер телефону'),
    body('address').notEmpty().withMessage('Введіть коректну адресу'),
]

module.exports = {
    adminValidator,
    goodsValidator,
    orderValidator
}