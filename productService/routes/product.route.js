const express=require('express')
const router =express.Router()
const productController = require('../controllers/product.controller')
const { withErrorHandling } = require('../helpers/error.config');


router.post('/createProduct',withErrorHandling(productController.createProduct))
router.post('/createOrder',withErrorHandling(productController.createOrder))
router.delete('/delete',withErrorHandling(productController.deleteProduct))
router.put('/update',withErrorHandling(productController.updateProduct))
router.get('/getProduct/:productId',withErrorHandling(productController))
router.post('/getProducts',withErrorHandling(productController.getProduct))

module.exports = router