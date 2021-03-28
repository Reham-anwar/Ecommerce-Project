const cloudinary = require("cloudinary");
const _ = require('underscore');
const fs = require('fs')
const Q = require("q");

function upload(file) {
    cloudinary.config({
        cloud_name: "rehamanwar",
        api_key: "889413342161585",
        api_secret: "iDU08GMAppgEUFuS7qO7Q1V_EZA"

    });

    return new Q.Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(file, {width: 100, height: 100}, (err, res) => {
            if (err) {
                console.log('cloudinary err:', err);
                reject(err);
            } else {
                console.log('cloudinary res:', res);
                return resolve(res);
            }
        });
    });
};


module.exports.upload = upload;