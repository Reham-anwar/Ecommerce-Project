require('./config/config');
require('./models/db')

require('./config/passportConfig');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const passport = require('passport');

const rtsIndex = require('./routes/index.router');
const mongoose = require('mongoose');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
extended:true
}));
const productRouter = require("./route/productRoute");
const cartRoute = require("./route/cartRoute");
const orderRoute =require('./route/orderRoute');
const { Router } = require('express');

// middleware
app.use(bodyParser.json());
app.use(cors());

app.use(passport.initialize());

app.use('/api', rtsIndex);
app.use('/api/products',productRouter );
app.use('/api/cart',cartRoute );
app.use('/api/order',orderRoute);


// error handler
app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
});

//start sever
app.listen(process.env.PORT,() => console.log(`Server started at port : ${process.env.PORT}`))

