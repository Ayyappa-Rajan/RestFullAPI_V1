const { User }          = require('../models');
const authService       = require('../services/auth.service');
const { to, ReE, ReS }  = require('../services/util.service');

const create = async function(req, res){  //creating new user function
    const body = req.body;
    
	if(!body.FirstName){
		return ReE(res, 'Please enter an First Name to register.');
	}else if(!body.LastName){
        return ReE(res, 'Please enter an Last Name to register.');
    }else if(!body.UserName){
        return ReE(res, 'Please enter an User Name to register.');
    }else if(!body.Password){
        return ReE(res, 'Please enter a Password to register.');
    }else if(!body.Email){
        return ReE(res, 'Please enter a Email to register.');
    }else if(!body.PhoneNumber){
        return ReE(res, 'Please enter a PhoneNumber to register.');
    }else{
        let err, user;

        [err, user] = await to(authService.createUser(body));

        if(err) return ReE(res, err, 422);
        return ReS(res, {message:'Successfully created new user.', user:user.toWeb(), token:user.getJWT()}, 201);
    }
}
module.exports.create = create;

const get = async function(req, res){  //getting current user details function
    let user = req.user;

    return ReS(res, {user:user.toWeb()});
}
module.exports.get = get;

const update = async function(req, res){ //updating current user details function
    let err, user, data
    user = req.user;
    data = req.body;
    user.set(data);

    [err, user] = await to(user.save());
    if(err){
        if(err.message=='Validation error') err = 'The email address or phone number is already in use';
        return ReE(res, err);
    }
    return ReS(res, {message :'Updated User: '+user.Email});
}
module.exports.update = update;

const remove = async function(req, res){ //deleting current user function
    let user, err;
    user = req.user;

    [err, user] = await to(user.destroy());
    if(err) return ReE(res, 'error occured trying to delete user');

    return ReS(res, {message:'Deleted User'}, 204);
}
module.exports.remove = remove;


const login = async function(req, res){  //login user verify function
    const body = req.body;
    let err, user;

    [err, user] = await to(authService.authUser(req.body));
    if(err) return ReE(res, err, 422);

    return ReS(res, {token:user.getJWT(), user:user.toWeb()});
}
module.exports.login = login;

const getAll = async function(req, res){  //get all user details function
        let err, user;
   
    [err, user] = await to(authService.findAllUser());
    if(err) return ReE(res, err, 422);

    return ReS(res, {user});
}
module.exports.getAll = getAll;

const getSpecific = async function(req, res){  //get specific user details function
    const phone = req.query.phone;
    let err, user;

    [err, user] = await to(authService.findUserByPhoneNumber(phone));
    if(err) return ReE(res, err, 422);
    if(!user) return ReE(res, 'No user found!..');
    return ReS(res, {user:user.toWeb()});
}
module.exports.getSpecific = getSpecific;