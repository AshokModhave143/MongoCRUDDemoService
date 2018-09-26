//app/routes.js
module.exports = (app, passport)=> {
    //Home page with login
    app.get('/', (req, res)=> {
        res.render('index.ejs');
    });

    //Login page
    app.get('/login', (req, res)=> {
        res.render('login.ejs', {message: ''});
    });

    //process login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    //Sign up
    app.get('/signup', (req,res)=> {
        //render page and pass any flash message if any
        res.render('signup.ejs', {message: req.flash('signupMessage')});
    });

    //process sign up form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    //profile section
    app.get('/profile', (req, res)=> {
        res.render('profile.ejs', {
            user: req.user
        });
    });

    //Logout
    app.get('/logout', (req, res)=> {
        req.logout();
        res.redirect('/');
    });
};

//route middleware to make sure user is logged in
const isLoggedIn = (req, res, next)=> {
    //if user is authenticated in session, carry on
    if(req.isAuthenticated()) {
        res.next();
    }

    //if they arent, redirect them to home page
    res.redirect('/');
};