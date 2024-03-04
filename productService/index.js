const express = require('express')
const mongoose = require('mongoose')
const app = express()
require('dotenv').config()
const {customLogger, apiResponseTime} = require('./helpers/customLogger')
const productRouter = require('./routes/product.route')
const bodyParser = require("body-parser");

app.use(bodyParser.json());
const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true 
}

app.use(customLogger)
app.use(apiResponseTime)
app.use('/api/v1',productRouter)
  
mongoose.connect(process.env.DB_URL,connectionParams)
  .then(() => {
    app.listen(process.env.PORT,(err) => {
        if(err) console.log("error occur while listening",process.env.PORT)
        console.log("server running successfully")
    })
  })
  .catch((error) => {
    console.log('error in mongoConnection',error)
  })

