const cardWebRoute = require('express').Router();
const { addConnection } = require('../controller/CardWebController');



cardWebRoute.post('/connection/add', addConnection);


module.exports = cardWebRoute;