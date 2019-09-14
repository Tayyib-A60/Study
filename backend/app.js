// Password Mongo XFK!JWt5My5Bz@_
// Connection String mongodb+srv://adesokantayyib:<password>@firstcluster-dtkuo.mongodb.net/test?retryWrites=true&w=majority

const express = require('express');
const bodyParser  = require('body-parser');
const mongoose = require('mongoose');
const courseRoutes = require('./routes/course.route');
const userRoutes = require('./routes/user.route');
const path = require('path');
// mongodb+srv://adesokantayyib:<password>@cluster0-li0zz.mongodb.net/test?retryWrites=true&w=majority
mongoose.connect('mongodb+srv://adesokantayyib:' + encodeURIComponent('adesokan')+'@cluster0-li0zz.mongodb.net/test?retryWrites=true&w=majority')
.then(() => {
    console.log('Successfully connected to MongoDb for study');
}).catch((err) => {
    console.log('Unable to connect to Mongo.Atlas');
    console.error(err);
});

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/course', courseRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;