const profileAuthRoute = require('express').Router();
const {
	userProfileCardCreation,
	userProfileImageData,
	userCoverImageData,
	userProfileData,
	storeLink,
	updateLink,
	updateEditProfile,
	toggleProfileVisibility,
	toggleLinkVisibility,
	deleteLink,
	deleteConnection
} = require('../../controller/ProfileCardController');
const { decodeToken, matchEmail } = require('../../middlewares');



profileAuthRoute.use(decodeToken);
profileAuthRoute.use(matchEmail);


// POST ROUTES
profileAuthRoute.post('/create/profile-card', userProfileCardCreation);
profileAuthRoute.post('/store/data/profile-image', userProfileImageData);


profileAuthRoute.post('/get/data/all', userProfileData);


profileAuthRoute.post('/store/link', storeLink);
profileAuthRoute.post('/update/link', updateLink);


profileAuthRoute.post('/update/profile', updateEditProfile);


profileAuthRoute.post('/toggle/profile-visibility', toggleProfileVisibility);
profileAuthRoute.post('/toggle/link-visibility', toggleLinkVisibility);


profileAuthRoute.post('/link/delete', deleteLink);

profileAuthRoute.post('/connection/delete', deleteConnection);


module.exports = profileAuthRoute;