const express = require('express')
const mongoose = require('mongoose')
const app = express()
require('dotenv').config()
const {customLogger, apiResponseTime} = require('./helpers/customLogger')
const orderRouter = require('./routes/order.route')
const bodyParser = require("body-parser");
const amqp = require("amqplib");
const orderController = require('./controllers/order.controller')


app.use(bodyParser.json());
const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true 
}

app.use(customLogger)
app.use(apiResponseTime)
app.use('/api/v1',orderRouter)

function setupOrderConsumer() {
  console.log("Connecting to RabbitMQ...");

  setTimeout(async () => {
    try {
      const amqpServer = 'amqp://rabbitmq';
      const connection = await amqp.connect(amqpServer);
      console.log("Connected to RabbitMQ",connection);
      const channel = await connection.createChannel();
      await channel.assertQueue("orders");

      channel.consume("orders", async (data) => {
        console.log("Consuming ORDER service",data);
        const { product, userId, orderId } = JSON.parse(data.content);
        console.log(product, userId, orderId)

        const order = await orderController.createOrder(JSON.parse(data.content))
        console.log(order)
        channel.sendToQueue(
          "products",
          Buffer.from(JSON.stringify(order))
        );
      });
    } catch (err) {
      console.error("Failed to connect to RabbitMQ:", err.message);
    }
  }, 10000); // add a delay to wait for RabbitMQ to start in docker-compose
}
setupOrderConsumer()
  
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

