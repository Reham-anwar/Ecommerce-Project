const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    title: 
    {
        type:String,
        required:true,
        // minLength:3,
        // maxLength:50
    },
    description:
    {
        type:String,
        required:true
    },
    price: 
    {
        type:Number,
        required:true
    },
    productImage:{
        type:String,
        required:true
    },
    cloudinaryId:{
        type:String
        
    }

});

const productModel = mongoose.model('product',productSchema);
module.exports = productModel;