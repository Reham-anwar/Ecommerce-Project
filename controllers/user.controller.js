const mongoose = require('mongoose');

const User = mongoose.model('User');

const passport = require('passport');
const _ = require('lodash');

const exportTest = require('../models/user.model')
// mongoose.connect('mongodb://localhost/3000')



var Cloudinary = require('../middleware/cloudinary').upload;
const Validator = require('validatorjs');
//multer package for upload img
const multer = require('multer');
const path =require('path');
const { response } = require('express');
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


module.exports.register = async (req, res, next) => {
    console.log('inside reg fn')
    // var user = new User();
    // user.name = req.body.name;
    // user.email = req.body.email;
    // user.password = req.body.password;
    // user.gender = req.body.gender;
    // user.userImage=req.body.userImage;
    // user.userType=req.body.userType;
    console.log("enterrrrrr")
    // res.json("yalahwiii");
    image =await Cloudinary(req.file.path);

    console.log(req.file);
    const {name,email,password,gender,userImage,userType} = req.body;

     const user =await User.create({ name:name,email:email,password:password,gender:gender,userImage:image.url,cloudinaryId:image.public_id,userType:userType})
        // res.send(user);

    user.save((err, doc) => {
        if (!err)
            res.send(doc);
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                return next(err);
        }

    });
}

module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({ "token": user.generateJwt(),"userType":user.userType });
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
}


module.exports.userProfile = (req, res, next) => {
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user: _.pick(user, ['name', 'email','userType','userImage','gender']) });
        }
    );
}

module.exports.editProfile = (req, res, next) => {
    const {name,email} = req.body;
  const modifiedUser =  User.updateOne({_id:req._id},{name:name,email:email}).exec();
  res.send(modifiedUser);
}
