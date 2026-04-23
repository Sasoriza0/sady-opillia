const { User, OTP, Order } = require('../models/models.js')
const {validationResult} = require('express-validator')
const ApiError = require('../error/ApiError.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const transporter = require('../config/mailConfig')

// Функція реєстрації
const register = async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.json(errors.array())
        }

        const existingUser = await User.findOne({email: req.body.email})

        if (existingUser) {
            return next(ApiError.badRequest('this email is already in use'))
        }

        const {password} = req.body
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const doc = new User({
            firstName: req.body.name,
            midleName: null,
            lastName: null,
            email: req.body.email,
            passwordHash: hash
        })

        const user = await doc.save()
        const token = jwt.sign({_id: user._id}, process.env.SECRET_KEY, {expiresIn: '7d'})

        const {passwordHash, ...userData} = user._doc
        
        res.json({
            ...userData,
            token
        })
    } catch (err) {
        console.log(err)
        next(ApiError.internal('непередбачувана помилка'))
    }
}

// Функція входу
const login = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email})
        if (!user) {
            return next(ApiError.badRequest('invalid password or email')) 
        }

        const  {password} = req.body
        const isPasswordValid = await bcrypt.compare(password, user._doc.passwordHash)
        if (!isPasswordValid) {
            return next(ApiError.badRequest('invalid password or email')) 
        }

        const token = jwt.sign({_id: user._id}, process.env.SECRET_KEY, {expiresIn: '7d'})

        const {passwordHash, ...userData} = user._doc
        
        res.json({
            ...userData,
            token,
            message: 'logined'
        })
    } catch (err) {
        console.log(err)
        next(ApiError.internal('непередбачувана помилка'))
    }
}

// Функція перевірки авторизації
const auth = async (req, res, next) => {
    try {
        const token = jwt.sign({_id: req.user._id}, process.env.SECRET_KEY, {expiresIn: '7d'})
        
        res.json({token})
    } catch (err) {
        console.log(err)
        next(ApiError.internal('непередбачувана помилка'))
    }
}

// Функція отримання інформації про користувача
const getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }

        const orders = await Order.find({ email: user.email });

        const { passwordHash, ...userData } = user._doc;
        res.json({...userData, orders});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Помилка на сервері' });
    }
}

// Функція оновлення даних користувача
const UserUpdate = async (req, res) => {
    try {
        const { firstName, lastName, midleName, email, phone } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }

        user.firstName = firstName;
        user.lastName = lastName;
        user.midleName = midleName;
        user.email = email;
        user.phone = phone;

        await user.save();

        res.json({ message: 'Дані успішно оновлено' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Помилка на сервері' });
    }
}

// Функція для надсилання OTP
const sendOTP = async (email) => {
    const otp = Math.floor(100000 + Math.random() * 900000) // Генерація 6-значного OTP
  
    // Зберігаємо OTP у базі даних
    const otpEntry = new OTP({ email, otp })
    await otpEntry.save();
  
    // Надсилаємо OTP на пошту
    await transporter.sendMail({
      to: email,
      subject: 'Відновлення пароля',
      html: `<p style="font-size: 20px;>Сади Опілля</p>
            <p style="font-size: 20px;>Ваш код для відновлення пароля:</p>
            <p style="font-size: 24px; font-weight: bold;">${otp}</p>`,
    })
  
    return otp
  }
  
  
// Функція для запиту на відновлення пароля
  const forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({message: 'Користувача з таким email не знайдено'})
    }
  
    await sendOTP(email)
  
    res.json({ message: 'Код для відновлення надіслано на пошту' })
  }

  const checkOTP = async (req, res) => {
    const { email, otp } = req.body
  
    const otpEntry = await OTP.findOne({ email, otp })
    if (!otpEntry) {
      return res.status(400).send('Невірний OTP')
    }

    const token = jwt.sign({email, otp}, process.env.SECRET_KEY, {expiresIn: '15m'})
  
    res.json({ message: 'OTP вірний', token })
  }
  

// Функція для скидання пароля
const resetPassword = async (req, res) => {
    const { newPassword, token } = req.body;
  
    try {
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.SECRET_KEY);
      } catch (err) {
        return res.status(400).json({ message: 'Не вдалось оновити пароль' });
      }
  
      const { email, otp } = decoded;
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Користувача з таким email не знайдено' });
      }
  
      const otpEntry = await OTP.findOne({ email, otp });
      if (!otpEntry) {
        return res.status(400).json({ message: 'Невірний OTP' });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newPassword, salt);
      user.passwordHash = hash;
      await user.save();
  
      await OTP.deleteOne({ email, otp });
  
      res.json({ message: 'Пароль успішно оновлено' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Помилка на сервері' });
    }
  };
  

module.exports = {
    register,
    login,
    auth,
    getUserInfo,
    UserUpdate,
    forgotPassword,
    resetPassword,
    checkOTP
}