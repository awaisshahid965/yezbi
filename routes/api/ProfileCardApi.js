const profileAuthRoute = require('express').Router();
const { userTextData, userImageData, storeLink } = require('../../controller/ProfileCardController');

profileAuthRoute.post('/store/data/text', userTextData);
profileAuthRoute.post('/store/data/image', userImageData);


profileAuthRoute.post('/store/link', storeLink);


module.exports = profileAuthRoute;