var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Cloudinary = require('../middleware/cloudinary').upload;
const Validator = require('validatorjs');
//multer package for upload img
const multer = require('multer');
const path =require('path');
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, '../uploads');
    },
    filename:function(req,file,cb){
        cb(null, file.originalname);
    }
});
//execute multer
const upload = multer({
    storage: storage,
    limits:{
    fileSize: 1024*1024*5
    }
});


//add product
router.post('/add-product',upload.single('productImage'),async(req,res,next)=>{
    console.log(req.file);
    image =await Cloudinary(req.file.path);
    console.log(image.url);
    console.log(image.public_id);

    const {title,description,price,productImage} = req.body;
   // res.json({desc:descripton});
    const product =await Product.create({ title:title,description:description,price:price,productImage:image.url,cloudinaryId:image.public_id})
       res.send(product);
});
//get products
router.get('/',async(req,res,next)=>{
    console.log('get product');
    // const product =await Product.find({},{_id:1,title:1,description:1,price:1,productImage:1}).exec();
    const product =await Product.find({}).exec();
    res.send(product);
});
//get product by id
router.get('/:id',async(req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product)
       return res.send({error:'this product id is not exist'});

    res.statusCode = 200;
    console.log(product);
    res.send(product);
})
//update product by id
router.patch('/edit-product/:id',async (req,res,next)=>{
    
   
    // get values from request body
    const { title, description, price } = req.body;
    //get product id
    const {id} = req.params;

    const product = await Product.findOne({_id:id}).exec();
   if(!product)
     return res.send({error:'this product id is not exist'});
 try{
     const modifiedProduct = await Product.updateOne({_id:id},{title:title,description:description,price:price}).exec();
     res.statusCode = 200;
     res.json({ Success: "product modified successfully" });
  }
  catch(err){
   res.statusCode = 500
   res.json({ Failure: 'can not modify product' })
  }
});
//delete product by id
router.delete('/delete-product/:id',async(req,res,next)=>{
    const product=await Product.findById(req.params.id);
    if(!product)
      return res.send({error:'this product id is not exist'});
    // console.log(Cloudinary.uploader);
    // await Cloudinary.uploader.destroy(product.cloudinaryId);
    await product.deleteOne(product);
    return res.send({message:'product deleted successfully'});
    res.send(product);
});



module.exports=router;