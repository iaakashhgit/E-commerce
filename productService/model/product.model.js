const mongoose = require("mongoose");
const { param } = require("../routes/product.route");

const productSchema = new mongoose.Schema(
  {
    _id : {
        type : String,
        required : true
    },
    name: {
      type: String,
      required: true,
      trim : true
    },
    description: {
      type: String,
      required: true,
      trim : true
    },
    discountedPrice: {
      type: String,
    },
    discountPercent: {
        type: String,
    },
    actualPrice: {
        type: String,
        required: true,
    },
    stock: {
      type: Number,
      required: true,
      default : 0
    },
    category: {
      type: String,
      required: true,
    },
    sellerId : {
        type : String,
        required : true
    },
    images : {
        type :[Object],
        required : true
    },
    videos : {
        type : [Object],
        required : true
    }
  },
  {
    timestamps: {
      createdAt: "_created_at",
      updatedAt: "_updated_at",
    },
    versionKey: false,
  }
);

productSchema.statics.createProduct = async function (params) {
    try {
        const newProduct = new this(params)
        return newProduct.save()
    }catch(error) {
        console.log('error in CreateProduct QUERY',error)
        return error
    }
};

productSchema.statics.updateProduct = async function (filter,updateObj) {
    try {
        return this.updateOne(filter,updateObj)
    }catch(error) {
        console.log('error in updateProduct Query',error)
        return error
    }
};

productSchema.statics.deleteProduct = async function (query) {
    try {
        return this.deleteOne(query)
    }catch(error) {
        console.log('error in deleteProduct',error)
        return error
    }
};

productSchema.statics.findProduct = async function (query) {
    try {
      console.log(query)
        return this.find(query)
    }catch(error) {
        console.log('error in FindProduct QUERY',error)
        return error
    }
};

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
