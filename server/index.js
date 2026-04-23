const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const fileUpload = require('express-fileupload')
const path = require('path')
const router = require('./routes/routes.js')
const errorHandling = require('./middleware/errorHandlingMiddleware.js')

dotenv.config()
const PORT = (process.env.PORT)
const DBURL = (process.env.DBURL)

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)
app.use(errorHandling)

function start() {
    mongoose
    .connect(DBURL)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`server started on port ${PORT}`)
        })
    })
    .catch((err) => {
        console.log(err)
    })
}

start()