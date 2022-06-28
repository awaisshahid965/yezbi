// imports
const express = require('express');
const cors = require('cors');
const fileUpload = require("express-fileupload");
const { connectToDatabase } = require('./config/database.config');
const ProfileCard = require('./models/ProfileCard');
const { logRequestPathAndType } = require('./middlewares');
// var setups
const app = express();


// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));
app.use(fileUpload());
app.use(logRequestPathAndType);


// setting view engine
app.set('view engine', 'ejs');
app.set('views', 'screens');


// initializing database
connectToDatabase(app);


app.get('/', async (req, res) => {
	// const usrProfileCard = await ProfileCard.deleteMany({ email : { $nin: ["awais@xyz.com"] } });
	// console.log(usrProfileCard)
	res.json({
		'ServerRunning': 'Okay...'
	});
});

/*
	** orange: #e68e2
	** red:    #e64e28
	** blue:   #2b84b2
	** purple: #432bb2, #6356a0
	** pink:   #c64b76
	** in-red: #c64b4b
	** brown:  #a79245
	** green:  #42957a
*/


app.use(require('./routes/CardWebRoutes'));
app.use('/api', require('./routes/api/ProfileCardApi'));
app.use('/api', require('./routes/api/DashboardApi'));

// { email : { $nin: ["awais@xyz.com"] } }