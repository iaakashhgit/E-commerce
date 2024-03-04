const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    _id : {
        type :String
    },
    userId: {
        type : String
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending','confirmed','shipped', 'delivered'],
        default: 'pending'
    },
    product : {
        type : [Object]
    }
});

orderSchema.statics.createOrder = async function (params) {
    try {
        const newOrder = new this(params)
        return newOrder.save()
    }catch(error) {
        console.log('error in CreateProduct QUERY',error)
        return error
    }
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
