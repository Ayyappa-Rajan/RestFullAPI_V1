'use strict';
const bcrypt 			= require('bcrypt');
const bcrypt_p 			= require('bcrypt-promise');
const jwt           	= require('jsonwebtoken');
const {TE, to}          = require('../services/util.service');
const CONFIG            = require('../config/config');

module.exports = (sequelize, DataTypes) => {    //Function contains all the users variable like objects
    var Model = sequelize.define('User', {
        FirstName : {type: DataTypes.STRING, allowNull: false},
        LastName  : {type: DataTypes.STRING, allowNull: false},
		UserName  : {type: DataTypes.STRING, allowNull: false},
		Password  : {type: DataTypes.STRING, allowNull: false},
        Email     : {type: DataTypes.STRING, allowNull: false,unique: true, validate: { isEmail: {msg: "Email invalid."} }},
        PhoneNumber     : {type: DataTypes.STRING, allowNull: false,  validate: { len: {args: [7, 20], msg: "Phone number invalid, too short."}, isNumeric: { msg: "not a valid phone number."} }},
        
    });

    Model.beforeSave(async (user, options) => {  //Function to convert plain password to encrypt form 
        let err;
        if (user.changed('Password')){
            let salt, hash
            [err, salt] = await to(bcrypt.genSalt(10));
            if(err) TE(err.message, true);

            [err, hash] = await to(bcrypt.hash(user.Password, salt));
            if(err) TE(err.message, true);

            user.Password = hash;
        }
    });

    Model.prototype.comparePassword = async function (pw) {  //Function to compare the password
        let err, pass
        if(!this.Password) TE('password not set');
        [err, pass] = await to(bcrypt_p.compare(pw, this.Password));
        if(err) TE(err);

        if(!pass) TE('invalid password');
        return this;
    }

    Model.prototype.getJWT = function () {      //Function to return JWT token
        let expiration_time = parseInt(CONFIG.jwt_expiration);
        return "Bearer "+jwt.sign({user_id:this.id}, CONFIG.jwt_encryption, {expiresIn: expiration_time});
    };

    Model.prototype.toWeb = function (pw) {  //Function to convert the user object to json string
        let json = this.toJSON();
        return json;
    };

    return Model;
};
