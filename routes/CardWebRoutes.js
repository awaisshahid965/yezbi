const cardWebRoute = require('express').Router();
const {
	addConnection,
	getProfileCard
} = require('../controller/CardWebController');



cardWebRoute.get('/:sid/share', getProfileCard);


cardWebRoute.post('/connection/add', addConnection);


module.exports = cardWebRoute;