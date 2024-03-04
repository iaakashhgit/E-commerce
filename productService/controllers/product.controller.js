const uuid = require('uuid')
const Product = require('../model/product.model')
const messageBroker = require("../helpers/messageBroker");

/**
 * 
 * @param {name,description,price,stock,category,sellerId} req 
 * @param {_id,name,description,price,stock,category,sellerId } res 
 * 
 */

exports.createProduct = async(req,res) => {
    const {body} = req
    const _id = uuid.v4()

    body._id = _id
    const product = await Product.createProduct(body)
    res.status(201).send({'message':"Product successfully Registered","status":201,"product":product})
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

exports.createOrder = async(req,res) => {
    const {quantity,userId,productId} = req.body
    let product = await Product.findProduct({_id : productId})
    const orderId = uuid.v4()
    const order = {
        orderId,
        product,
        userId : userId,
        quantity,
        status : "pending"
    }

    await messageBroker.publishMessage("orders", {
        product,
        userId: userId,
        orderId,
    });
    let orderData
    await messageBroker.consumeMessage("products", (data) => {
        orderData = JSON.parse(JSON.stringify(data));
    });
    console.log(orderData)
    return res.status(201).send({'message':"order created successfully",order : orderData})
}