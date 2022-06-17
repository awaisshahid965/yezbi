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
	// updateEditProfileTest
} = require('../../controller/ProfileCardController');


// POST ROUTES
profileAuthRoute.post('/create/profile-card', userProfileCardCreation);
profileAuthRoute.post('/store/data/profile-image', userProfileImageData);
// profileAuthRoute.post('/store/data/cover-image', userCoverImageData);


profileAuthRoute.post('/get/data/all', userProfileData);


profileAuthRoute.post('/store/link', storeLink);
profileAuthRoute.post('/update/link', updateLink);


// profileAuthRoute.post('/update/profile', updateEditProfile);
profileAuthRoute.post('/update/profile', updateEditProfile);


profileAuthRoute.post('/toggle/profile-visibility', toggleProfileVisibility);
profileAuthRoute.post('/toggle/link-visibility', toggleLinkVisibility);


profileAuthRoute.post('/toggle/delete-link', deleteLink);


module.exports = profileAuthRoute;

// {
// 	"email": "awais@xyz.com",
// 	"name": "Muhammad Awais Shahid",
// 	"location": "Haroonabad, Punjab, Pakistan.",
// 	"theme": "",
// 	"bio": "",
// 	"businessClient": false
// }