/* Models : app/model/user.js */
//libs
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const SALT_WORK_FACTOR = 8;

//schema for usermodel
const userSchema = mongoose.Schema({
    local: {
        email: String,
        password: String
    },
    facebook: {
        id: String,
        token: String,
        name: String,
        email: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }
});

//methods ----------
//Generating hash
userSchema.methods.generateHash = (password)=> {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_WORK_FACTOR), null);
};

//Checking if password is valid or not
userSchema.methods.validPassword = (password)=> {
    console.log(this);
    return bcrypt.compareSync(password,this.password); 
};

//create model for users and exporse it to app
module.exports = mongoose.model('UserInfo', userSchema);
