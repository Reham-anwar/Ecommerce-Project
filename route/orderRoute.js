var express = require('express');
var router = express.Router();
var Order = require('../models/order');
//multer package for upload img
var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Cloudinary = require('../middleware/cloudinary').upload;
const Validator = require('validatorjs');
//multer package for upload img
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('../models/product');
const passport = require('passport');
const _ = require('lodash');
const jwtHelper = require('../config/jwtHelper');
const { any } = require('underscore');
const User = mongoose.model('User');

// router.post('/addorder',async(req,res)=>{
 
//     const{username,date,totalPrice,titles,status} =req.body;

//     const order =  await Order.create({username:username,date:date,totalPrice:totalPrice,titles:titles,status:status});
//        res.send(order);
// });

// POST: handle checkout logic and payment using Stripe
router.get("/placeOrder/:id",jwtHelper.verifyJwtToken, async (req, res) => {
    const cartId = req.params.id;
    const cart = await Cart.findById(req.params.id);
    console.log(cart);
  if(cart.items.length !== 0){
      const userDetails = await User.findById(req._id); 
      console.log(userDetails.name);
        let order = new Order({
          userId: req._id,
          userName:userDetails.name,
          cart: {
            totalQty: cart.totalQty,
            totalCost: cart.totalCost,
            items: cart.items,
          }
        });
      await order.save(async (err,newOrder)=>{
          if(err){
              console.log(err);
              return ;
          }
          await cart.save();
          await Cart.findByIdAndDelete(cartId);
      });
    
           res.send(order)
    }
    else{
        console.log("is empty");
    }
        });
 






router.get('/userOrder',jwtHelper.verifyJwtToken,async(req,res,next)=>{
  
    const order =await Order.find({userId:req._id}).exec();
    res.send(order);
});
router.get('/',jwtHelper.verifyJwtToken,async(req,res,next)=>{
  
    const order =await Order.find({}).exec();
    res.send(order);
});
router.patch('/adminedit/:id',jwtHelper.verifyJwtToken,async (req,res,next)=>{
    try{
        const OrderId=req.params.id;
        const{status} =req.body;
        await Order.updateOne({_id:OrderId},{status:status});
        res.statusCode=200;
        res.send({message:'updated successfully',success:true});
        next();
    }
    catch(err){
        res.statusCode = 401;
        res.send({success:false, message:err});
        return handleError(err);
    }
});

router.delete('/delete/:id',jwtHelper.verifyJwtToken,async (req,res,next)=>{
    try{
        const orderId=req.params.id;
        const orderDetails = await Order.findById(orderId);
        if(orderDetails.status==='pending'){
        await Order.deleteOne({_id:orderId});
        res.statusCode=200;
        res.send({message:'deleted successfully',success:true});
        next();
        }else{
            console.log("not pending");
            res.json("its not pending");
        }
    }
    catch(err){
        res.statusCode = 401;
        res.send({success:false, message:err});
        return handleError(err);
    }
})
// router.get('/getuserorders',jwtHelper.verifyJwtToken,async (req,res,next)=>{
//     try{
//         const userDetails = await User.findById(req._id);
//         console.log(userDetails);
//         const orders = await Order.find({userName:userDetails.name},{}).exec();
//         res.statusCode =200;
//         res.send({success:true,orders});
//         next();
//     }
//     catch(err){
//         res.statusCode = 401;
//         res.send({success:false, message:err});
//         return handleError(err);
//     }
// })
module.exports = router