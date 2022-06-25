const dashboardRoute = require('express').Router();
const { allUserData } = require('../../controller/DashboardController');
const { decodeToken, matchEmail } = require('../../middlewares');

dashboardRoute.use(decodeToken);
dashboardRoute.use(matchEmail);

dashboardRoute.post('/user-data/all', allUserData);


module.exports = dashboardRoute;