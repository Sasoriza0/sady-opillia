const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'service',
  auth: {
    user: 'user', 
    pass: 'pass',
  },
})

module.exports = transporter