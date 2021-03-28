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
const User = mongoose.model('User');

// add new cart//////////////////////////////////////important/////////////////////
// router.post('/add-to-cart', jwtHelper.verifyJwtToken, async (req, res, next) => {
//     // console.log(req.file);
//     // image =await Cloudinary(req.file.path);
//     // console.log(image.url);
//     // console.log(image.public_id);
//     // res.json({desc:descripton});
//     const cart = await Cart.create({ _userId:req._id})
//     res.send(cart);
// })
router.get("/",jwtHelper.verifyJwtToken,  async (req, res) => {
    const cart =await Cart.find({ _userId:req._id}).exec();
    res.send(cart);
})
router.get("/add-to-cart/:id",jwtHelper.verifyJwtToken,  async (req, res) => {
    const productId = req.params.id;
    try {
      // get the correct cart, either from the db, session, or an empty cart.
      let user_cart;
      if (req._id) {
        user_cart = await Cart.findOne({  _userId:req._id});
      //  console.log(user_cart);
      }
      let cart;
      if ( !user_cart ) {
        cart = await new Cart({_userId:req._id});
       
      } else {
        cart = user_cart;
     //   console.log(cart);
      }
  
      // add the product to the cart
      const product = await Product.findById(productId);
      const itemIndex = cart.items.findIndex((p) => p.productId == productId);
      if (itemIndex > -1) {
        // if product exists in the cart, update the quantity
        cart.items[itemIndex].qty++;
        cart.items[itemIndex].price = cart.items[itemIndex].qty * product.price;
        cart.totalQty++;
        cart.totalCost += product.price;
      } else {
        // if product does not exists in cart, find it in the db to retrieve its price and add new item
        cart.items.push({
          productId: productId,
          qty: 1,
          price: product.price,
          title: product.title,
          productImage:product.productImage
        });
        cart.totalQty++;
        cart.totalCost += product.price;
      }
  
      // if the user is logged in, store the user's id and save cart to the db
      if (req._id) {
        
        await cart.save();
        //console.log(cart);
      }
    //   req.session.cart = cart;
      console.log(cart);
      res.send(cart);
    //   req.json("added successfully");
    //   req.flash("success", "Item added to the shopping cart");
    //   res.redirect(req.headers.referer);
    } catch (err) {
      console.log(err.message);
    //   res.redirect("/");
    }
  });

// GET: remove all instances of a single product from the cart
router.get("/removeAll/:id",jwtHelper.verifyJwtToken, async function (req, res, next) {
    const productId = req.params.id;
    let cart;
    try {
      if (req._id) {
        cart = await Cart.findOne({ _userId: req._id });
      }
      //fnd the item with productId
      let itemIndex = cart.items.findIndex((p) => p.productId == productId);
      if (itemIndex > -1) {
        //find the product to find its price
        cart.totalQty -= cart.items[itemIndex].qty;
        cart.totalCost -= cart.items[itemIndex].price;
        await cart.items.remove({ _id: cart.items[itemIndex]._id });
      }
    //   req.session.cart = cart;
      //save the cart it only if user is logged in
      if (req._id) {
        await cart.save();
      }
      //delete cart if qty is 0
      if (cart.totalQty <= 0) {
       
        await Cart.findByIdAndRemove(cart._id);
      }
      res.send(cart);
    } catch (err) {
      console.log(err.message);

    }
  });

// GET: reduce one from an item in the shopping cart
router.get("/reduce/:id", jwtHelper.verifyJwtToken, async function (req, res, next) {
    // if a user is logged in, reduce from the user's cart and save
    // else reduce from the session's cart
    const productId = req.params.id;
    let cart;
    try {
      if (req._id) {
        cart = await Cart.findOne({_userId: req._id });
      } 
  
      // find the item with productId
      let itemIndex = cart.items.findIndex((p) => p.productId == productId);
      console.log(itemIndex);
      if (itemIndex > -1) {
        // find the product to find its price
        const product = await Product.findById(productId);
        // if product is found, reduce its qty
        cart.items[itemIndex].qty--;
        cart.items[itemIndex].price -= product.price;
        cart.totalQty--;
        cart.totalCost -= product.price;
        // if the item's qty reaches 0, remove it from the cart
        if (cart.items[itemIndex].qty <= 0) {
          await cart.items.remove({ _id: cart.items[itemIndex]._id });
        }
        // req.session.cart = cart;
        //save the cart it only if user is logged in
        if (req._id) {
          await cart.save();
        }
        //delete cart if qty is 0
        if (cart.totalQty <= 0) {
        //   req.session.cart = null;
          await Cart.findByIdAndRemove(cart._id);
        }
      }
    res.send(cart);
    } catch (err) {
      console.log(err.message);
     
    }
  });
  


// router.post('/add-to-cart', async (req, res, next) => {
//     // console.log(req.file);
//     // image =await Cloudinary(req.file.path);
//     // console.log(image.url);
//     // console.log(image.public_id);
//     const { productId } = req.body;
//     // res.json({desc:descripton});
//     const cart = await Cart.create({ productId: productId })
//     res.send(cart);
// });

//get all carts
// router.get('/',async(req,res,next)=>{
//     console.log('get cart');
//     const cart =await Cart.find({},{_id:1,productId:1}).exec();
//     res.send(cart);
// });

// router.get('/',jwtHelper.verifyJwtToken, (req, res, next) => {
//     console.log('get cart');
//     User.findOne({ _id: req._id },
//         (err, user) => {
//             if (!user)
//                 return res.status(404).json({ status: false, message: 'User record not found.' });
//             else {
//                 return Cart.find({}, { _id: 1, productId: 1 },
//                     (err, cart) => {
//                         if (!cart)
//                             return res.status(404).json({ status: false, message: 'cart record not found.' });
//                         else
//                             return res.status(200).json({ status: true, cart: _.pick(cart, ['productId']) });
//                     });
//             }
//         });
// });




router.patch('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { Quantity } = req.body;
        await Cart.updateOne({ _id: id }, { quantity: Quantity });
        res.statusCode = 200;
        res.send({ message: 'updated successfully', success: true });
        next();
    }
    catch (err) {
        res.statusCode = 401;
        res.send({ success: false, message: err });
        return handleError(err);
    }
});

router.delete('/delete/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await Cart.deleteOne({ _id: id });
        res.statusCode = 200;
        res.send({ message: 'deleted successfully', success: true });
        next();
    }
    catch (err) {
        res.statusCode = 401;
        res.send({ success: false, message: err });
        return handleError(err);
    }
})



module.exports = router;