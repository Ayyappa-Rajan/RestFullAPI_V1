const express 			= require('express');
const router 			= express.Router();

const UserController 	= require('../controllers/user.controller');
const passport      	= require('passport');

require('./../middleware/passport')(passport)
/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({status:"success", message:"BlueAlly Infotech API", data:{"version_number":"v1.0.0"}})
});

/*API to create new user without Authentication signing*/
router.post(    '/users',           UserController.create);                                                    // C    
router.get(     '/users',           passport.authenticate('jwt', {session:false}), UserController.get);        // R
router.put(     '/users',           passport.authenticate('jwt', {session:false}), UserController.update);     // U
router.delete(  '/users',           passport.authenticate('jwt', {session:false}), UserController.remove);     // D
/*API to create new user with Authentication*/
router.post(    '/users/create',    passport.authenticate('jwt', {session:false}),UserController.create);
/*API to findAll user with Authentication*/
router.get(     '/users/findall',   passport.authenticate('jwt', {session:false}), UserController.getAll);
/*API to findSpecific user by phoneNumber with Authentication*/
router.get(     '/users/findspecific',   passport.authenticate('jwt', {session:false}), UserController.getSpecific);
/*Login API  token as response*/
router.post(    '/users/login',     UserController.login);

module.exports = router;
