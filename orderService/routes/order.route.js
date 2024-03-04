const express=require('express')
const router =express.Router()
const orderController = require('../controllers/order.controller')
const { withErrorHandling } = require('../helpers/error.config');


router.post('/createOrder',withErrorHandling(orderController.createOrder))
// router.delete('/delete',withErrorHandling(orderController.deleteProduct))
// router.put('/update',withErrorHandling(orderController.updateProduct))
// router.get('/getOrder',withErrorHandling(orderController))
// router.post('/getOrders',withErrorHandling(orderController.getProduct))

module.exports = router