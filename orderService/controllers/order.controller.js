const uuid = require('uuid')
const Order = require('../model/order.model')

/**
 * 
 * @param {name,description,price,stock,category,sellerId} req 
 * @param {_id,name,description,price,stock,category,sellerId } res 
 * 
 */

exports.createOrder = async(params) => {
    const {product,userId,orderId} = params

    const body =    {
        _id : orderId,
        product,
        userId,
        status : 'confirmed'
    }

    let orders = await Order.createOrder(body)
    return orders
}


exports.getProduct = async(req,res) => {
    const {body} = req
    let query = {}
    let products
    if(body.isFilter) {
        //TODO : ADD REGEX
        query = body.filterObj
        products = await Product.findProduct(query)
    } else {
        products = await Product.findProduct(query)
        console.log(products)
    }

    return res.status(200).send({'message':"Product fetch Successfully","status":200,"product":products})
}


exports.updateProduct = async(req,res) => {
    const {body}  = req
    let update = {}
    let queryFilter = {}

    const productId = req.query.productId
    queryFilter._id = productId

    if(body?.images) {
        update.$push = { images: { $each: body?.images } }
    }

    if(body?.videos) {
        update.$push =  { vidoes: { $each: body?.videos } }
    }

    update.$set = body.updateObject

    const response =  await Product.updateProduct(queryFilter,update)
    return res.status(200).send({'message':"Product update Successfully","status":200,"product":response})

}


exports.deleteProduct = async(req,res) => {
    const productId = req.query.productId
    const query = {_id : productId}
    let response = await Product.deleteProduct(query)
    return res.status(200).send({'message':"Product delete Successfully","status":200,"product":response})

}