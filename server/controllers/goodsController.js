const { Goods } = require('../models/models.js')
const ApiError = require('../error/ApiError.js')
const mongoose = require('mongoose')
const uuid = require('uuid')
const path = require('path')
const fs = require('fs');


const checkValidId = (id) => {
    if (!mongoose.isValidObjectId(id)) {
        throw ApiError.badRequest('Вказане вами ID некоректне');
    }
};

/**
 * @route /api/goods/add
 * @desc add new goods
 * @access private
*/
const add = async (req, res, next) => {
    try {
      if (!req.files || !req.files.image) {
        return next(ApiError.badRequest('Зображення не завантажене'));
      }
  
      const { image } = req.files;
  
      const fileName = uuid.v4() + '.jpg';
      const imagePath = path.resolve(__dirname, '..', 'static', fileName);
  
      await image.mv(imagePath);
  
      const doc = new Goods({
        name: req.body.name,
        sort: req.body.sort,
        price: req.body.price,
        description: req.body.description,
        fruitType: req.body.fruitType,
        count: req.body.count,
        isInStok: true,
        image: fileName
      });
  
      const goods = await doc.save();
  
      res.status(201).json({ goods });
    } catch (err) {
      console.error('Помилка при додаванні товару:', err);
      next(ApiError.internal('Непередбачувана помилка'));
    }
  };

/**
 * @route /api/goods/view
 * @desc get all goods
 * @access public
*/
const getAll = async (req, res, next) => {
    try {
        const goods = await Goods.find()
        if (goods.length < 1) {
            return res.status(204).json({
                message: 'Немає'
            })
        }

        res.json({
            goods
        })
    } catch (err) {
        next(ApiError.internal('Непередбачувана помилка'))
    }
}

/**
 * @route /api/goods/view/:fruitType
 * @desc get goods by typy
 * @access public
*/
const getByFruitType = async (req, res, next) => {
    try {
        const {type} = req.params

        const goods = await Goods.find({fruitType: type})

        if (goods.length < 1) {
            return res.status(204).json({
                message: 'Немає'
            })
        }

        res.json({
            goods
        })
    } catch (err) {
        next(ApiError.internal('Непередбачувана помилка'))
    }
}

/**
 * @route /api/goods/view/:id
 * @desc get goods by id
 * @access public
*/
const getById = async (req, res, next) => {
    try {
        const {id} = req.params
        checkValidId(id)

        const goods = await Goods.findById(id)
        if (!goods) {
            return next(ApiError.badRequest('Дані не знайдено'))
        }

        res.json({
            goods
        })
    } catch (err) {
        next(ApiError.internal('Непередбачувана помилка'))
    }
}

/**
 * @route /api/goods/update
 * @desc update goods
 * @access private
*/
const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        checkValidId(id);

        const goods = await Goods.findById(id);
        if (!goods) {
            return next(ApiError.badRequest('Товар не знайдений'))
        }

        let fileName = goods.image
        const files = req.files;

        if (files && files.image) {
            const image = files.image;
            fileName = uuid.v4() + '.jpg';
            await image.mv(path.resolve(__dirname, '..', 'static', fileName));

            const oldImagePath = path.resolve(__dirname, '..', 'static', goods.image);
            fs.unlink(oldImagePath, () => {});
        }

        const updatedGoods = await Goods.findByIdAndUpdate(
            id,
            {
                name: req.body.name,
                sort: req.body.sort,
                price: req.body.price,
                description: req.body.description,
                fruitType: req.body.fruitType,
                season: req.body.season,
                count: req.body.count,
                isInStok: true,
                image: fileName
            },
            { new: true }
        )

        res.json({
            updatedGoods
        })
    } catch (err) {
        next(ApiError.internal('Непередбачувана помилка'))
    }
}

/**
 * @route /api/goods/remove
 * @desc remove goods
 * @access private
*/
const remove = async (req, res, next) => {
    try {
        const {id} = req.params
        checkValidId(id)

        const goods = await Goods.findById(id)
        if (!goods) {
            return next(ApiError.badRequest('Товар не знайдено'))
        }

        const image = path.resolve(__dirname, '..', 'static', goods._doc.image)
        fs.unlink(image, () => {})

        await Goods.findByIdAndDelete(id)
        res.json({
            message: 'Успішно видалено'
        })
    } catch (err) {
        next(ApiError.internal('Непередбачувана помилка'))
    }
}

module.exports = {
    add,
    getAll,
    getByFruitType,
    getById,
    update,
    remove
}