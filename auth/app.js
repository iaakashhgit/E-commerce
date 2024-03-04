const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const cors = require('cors')
let bodyParser = require('body-parser')

const {router: usersRoute} = require('./routes/user.route')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use('/users', usersRoute)

app.use(express.json({ limit: "16kb" }))

module.exports = { app }