const profileAuthRoute = require('express').Router();
const {
	userProfileCardCreation,
	userProfileImageData,
	userCoverImageData,
	userProfileData,
	storeLink,
	updateLink,
	updateEditProfile,
	toggleProfileVisibility
} = require('../../controller/ProfileCardController');


// POST ROUTES
profileAuthRoute.post('/create/profile-card', userProfileCardCreation);
profileAuthRoute.post('/store/data/profile-image', userProfileImageData);
profileAuthRoute.post('/store/data/cover-image', userCoverImageData);


profileAuthRoute.post('/get/data/all', userProfileData);


profileAuthRoute.post('/store/link', storeLink);
profileAuthRoute.post('/update/link', updateLink);


profileAuthRoute.post('/update/profile', updateEditProfile);


profileAuthRoute.post('/toggle/profile-visibility', toggleProfileVisibility);


module.exports = profileAuthRoute;