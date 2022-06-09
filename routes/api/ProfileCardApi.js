const profileAuthRoute = require('express').Router();
const {
	userTextData,
	userImageData,
	storeLink,
	fetchOneTypeLinks,
	activeLinksList,
	updateActiveLink
} = require('../../controller/ProfileCardController');

profileAuthRoute.post('/store/data/text', userTextData);
profileAuthRoute.post('/store/data/image', userImageData);


profileAuthRoute.post('/store/link', storeLink);
profileAuthRoute.post('/get/links/one-type', fetchOneTypeLinks);


profileAuthRoute.post('/get/links/added', activeLinksList);
profileAuthRoute.post('/update/link/active', updateActiveLink);


module.exports = profileAuthRoute;