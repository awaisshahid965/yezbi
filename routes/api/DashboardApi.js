const dashboardRoute = require('express').Router();
const { allUserData } = require('../../controller/DashboardController');

dashboardRoute.post('/users', allUserData);


module.exports = dashboardRoute;