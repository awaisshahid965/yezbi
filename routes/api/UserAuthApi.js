const userAuthRoute = require('express').Router();
const { signup } = require('../../controller/UserAuthController');

userAuthRoute.post('/signup', signup);


module.exports = userAuthRoute;