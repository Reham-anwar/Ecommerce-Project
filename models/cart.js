const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({

 items:[
     {
       
        productId: {
            type:String
          },
          qty: {
            type: Number,
            default: 0,
          },
          price: {
            type: Number,
            default: 0,
          },
          title: {
            type: String,
          },
          productImage:{
            type:String,

          }
   
        }
 ],
 totalQty: {
    type: Number,
    default: 0,
    required: true,
  },
  totalCost: {
    type: Number,
    default: 0,
    required: true,
  },
 _userId: {
    type:String,
    required: false,
}
 
});

const cartModel = mongoose.model('cart',cartSchema);
module.exports = cartModel;