const dashboardRoute = require('express').Router();
const { allUserData } = require('../../controller/DashboardController');

dashboardRoute.post('/user-data/all', allUserData);


module.exports = dashboardRoute;