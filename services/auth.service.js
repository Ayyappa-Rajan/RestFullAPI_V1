const { User } 	    = require('../models');
const validator     = require('validator');
const { to, TE }    = require('../services/util.service');

const getUniqueKeyFromBody = function(body){// this is so they can send in 3 options unique_key, email, or phone and it will work
    let unique_key = body.unique_key;
    if(typeof unique_key==='undefined'){
        if(typeof body.Email != 'undefined'){
            unique_key = body.Email
        }else if(typeof body.PhoneNumber != 'undefined'){
            unique_key = body.PhoneNumber
        }else{
            unique_key = null;
        }
    }
    return unique_key;
}
module.exports.getUniqueKeyFromBody = getUniqueKeyFromBody;

const createUser = async (userInfo) => { //Create new user
    let unique_key, auth_info, err;
    auth_info={};
    auth_info.status='create';
	
	let user;
    unique_key = getUniqueKeyFromBody(userInfo);
    if(!unique_key) TE('An email or phone number was not entered.');

    if(validator.isEmail(unique_key)){
        auth_info.method = 'email';
        userInfo.email = unique_key;

        [err, user] = await to(User.create(userInfo));
        if(err) TE('Error in creating user ' + err.message);

        return user;

    }else if(validator.isMobilePhone(unique_key, 'any')){//checks if only phone number was sent
        auth_info.method = 'phone';
        userInfo.phone = unique_key;

        [err, user] = await to(User.create(userInfo));
        if(err) TE('user already exists with that phone number ' + err.message);

        return user;
    }else{
        TE('A valid email or phone number was not entered.');
    }
}
module.exports.createUser = createUser;

const authUser = async function(userInfo){//returns token
    let unique_key;
    let auth_info = {};
    auth_info.status = 'login';
    unique_key = getUniqueKeyFromBody(userInfo);

    if(!unique_key) TE('Please enter an Email or phone number to login');


    if(!userInfo.Password) TE('Please enter a password to login');

    let user;
    if(validator.isEmail(unique_key)){
        auth_info.method='Email';

        [err, user] = await to(User.findOne({where:{Email:unique_key}}));
        if(err) TE(err.message);

    }else if(validator.isMobilePhone(unique_key, 'any')){//checks if only phone number was sent
        auth_info.method='phone';

        [err, user] = await to(User.findOne({where:{PhoneNumber:unique_key }}));
        if(err) TE(err.message);

    }else{
        TE('A valid email or phone number was not entered');
    }

    if(!user) TE('Not registered');

    [err, user] = await to(user.comparePassword(userInfo.Password));

    if(err) TE(err.message);

    return user;

}
module.exports.authUser = authUser;

const findAllUser = async function(){//returns all users
    let user,err;    
	[err, user] = await to(User.findAll());

    if(err) TE(err.message);
    return user;
}
module.exports.findAllUser = findAllUser;

const findUserByPhoneNumber = async function(searchInfo){//returns user by phoneNumber
    let user,err;    
	
	[err, user] = await to(User.findOne({where:{PhoneNumber:searchInfo }}));
        if(err) TE(err.message);

    if(err) TE(err.message);
    return user;
}
module.exports.findUserByPhoneNumber = findUserByPhoneNumber;