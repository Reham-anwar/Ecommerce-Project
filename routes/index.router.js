const express = require('express');
const router = express.Router();

const ctrlUser = require('../controllers/user.controller');


const jwtHelper = require('../config/jwtHelper');

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



router.post('/register',upload.single('userImage'),ctrlUser.register);
router.post('/authenticate', ctrlUser.authenticate);
router.get('/userProfile',jwtHelper.verifyJwtToken, ctrlUser.userProfile);
router.patch('/editProfile',jwtHelper.verifyJwtToken, ctrlUser.editProfile);


module.exports = router;