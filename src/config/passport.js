/* config/passport.js configuration */
//Libs
let LocalStrategy = require('passport-local').Strategy;

//load user model
let User = require('./../app/model/user');

module.exports = (passport) => {
    //Passport session set up -----

    //required for persistent login sessions
    //passport needs ability to serialize or unserialize users out of session

    //used to serialize the user for session
    passport.serializeUser((user, done)=> {
        done(null, user.id);
    });

    //used to deserialize the user
    passport.deserializeUser((id, done)=> {
        User.findById(id, (err, user)=> {
            done(err, user);
        });
    })

    //Local Signup-----
    passport.use('local-signup', new LocalStrategy({
            //by  default, localstrategy uses 'username' and 'password', we will override the actual name 'email'
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true //allows us to pass back the entire request to callback
        },
        function(req, email, password, done) { 
            //asynchronus
            //User.findOne wont fire unless data is sent back 
            process.nextTick(()=> {
                //find user whose email is same as forms email
                //we are trying to see if the user  trying to login, already exists
                User.findOne({'local.email' : email}, (err, user)=> {
                    if(err) {
                        return done(err);
                    }

                    //check to see if there is already user with same email
                    if(user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken'));
                    } else {
                        //if no user with that email, create new user
                        let newUser = new User();

                        //set users local credentials
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);

                        console.log('New User : ' + newUser);

                        //Save the user
                        newUser.save((err)=> {
                            if(err) {
                                throw err;
                            }
                            return done(null, newUser);
                        });
                    }
                });
            });
        })
    );

    //Local Login ----
    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {
            //find user with same email as form
            User.findOne({'local.email': email }, function(err, user) {
                //if there are errors found, return errors before anything else
                if(err) {
                    return done(err);
                }

                //if no user found return message
                if(!user) {
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                }
                //user = JSON.parse(JSON.stringify(user));
                //if user found but password is wrong
                if(!user.validPassword(password)) {
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                }

                //all well, return success
                return done(null, user);
            });
        }
    ));
};