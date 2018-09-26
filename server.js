/* Libs import */
const express = require('express');
const path = require('path');
const open = require('open');
//const mongodb = require('mongodb');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

/* Local Imports */
const configDB = require('./src/config/database');

//Initialization
const app = express();
const port = process.env.PORT || 3000;

//Configuration
mongoose.connect(configDB.url); //connect to our database

//Passport initialization
require('./src/config/passport')(passport); //pass passport for configuration

//Set up Express application
app.use(morgan('dev')); // log every request to console
app.use(cookieParser('secret')); //Read cookies (needed for auth)
app.use(bodyParser()); //get information from html forms
app.use(bodyParser.urlencoded({extended: true}));

app.set('views', __dirname + '/src/views');
app.set('view engine', 'ejs');

//Passport configuration
const secretKey = '';//'thisissecretekey';
app.use(session({secret: '' })); //session secrete
app.use(passport.initialize());
app.use(passport.session()); //persistent login session
app.use(flash());  //use connect-flash for flash messages stored in session

//routes
require('./src/app/routes.js')(app, passport); //load our routes and pass in our app and fully configured passport


//launch
app.listen(port);
console.log(`Server started at port ${port}`);

/*
app.get('/', (req, res) => {
    //console.log('Hello There!!!!!');
    //res.send('Hello');
    res.sendFile(__dirname + '/index.html');
});
const MongoClient = mongodb.MongoClient;
let url = 'mongodb://127.0.0.1:27017';
let dbname = 'mydhan';
let db = null;

MongoClient.connect(url, (err, client)=> {
    if(err) {
        return console.log('Unable to connect to sever', err);
    }
    else {
        console.log('Connection established');
        db = client.db(dbname);
        app.listen(port, ()=> {
            console.log(`Server started...listening on port ${port}`);
        });        
    }
});

//GET all users
app.get('/users', (req, res)=> {
    console.log(req.body);
    db.collection('users').find().toArray((err, result)=> {
        if(err) {
            return console.log('Error while fetching collection');
        }
        else if(result.length) {
            res.json(result);
        }
        else {
            res.render('No document found');
        }
    });
});

//POST - Add new user
app.post('/adduser', (req, res)=> {
    const body = req.body;
    console.log(body);

    let item = {"userName":"Harshal","email":"a1@xyz.com","contact":"+91123456789"};
    db.collection('users').insert(item).then((result)=>{    
        console.log(result);
        res.render(result.ok);
    }).catch((error)=> {
        console.log(error);
        res.render(error);
    });
});

// app.listen(port, ()=> {
//     console.log(`Server started...listening on port ${port}`);
//     //open(`http://localhost:${port}`);
// });
*/