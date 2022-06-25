// imports
const express = require('express');
const cors = require('cors');
const fileUpload = require("express-fileupload");
const { connectToDatabase } = require('./config/database.config');
const ProfileCard = require('./models/ProfileCard');
const middleware = require('./middlewares');
const linksAppSupports = require('./linksAppSupports');
// var setups
const app = express();


// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));
app.use(fileUpload());
app.use(middleware.decodeToken);
app.use(middleware.matchEmail);
app.use(middleware.logRequestPathAndType);


// setting view engine
app.set('view engine', 'ejs');
app.set('views', 'screens');


// initializing database
connectToDatabase(app);


app.get('/', (req, res) => {
	res.json({
		'ServerRunning': 'Okay...'
	})
});

app.post('/api/todos', (req, res) => {
	return res.json({
		todos: [
			{
				title: 'Task1',
			},
			{
				title: 'Task2',
			},
			{
				title: 'Task3',
			},
		],
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
app.get('/:sid/share', async (req, res) => {
	let { sid } = req.params;
	try {
		const {
				_id,
				name,
				email,
				coverImgUrl,
				profileImgUrl,
				theme,
				location,
				links
		} = await ProfileCard.findOne({ shortUserId: sid }).select('-connections');


		res.render('profile-card', {
			linksAppSupports,
			_id,
			name,
			email,
			profileImgUrl,
			coverImgUrl,
			theme,
			location,
			links
		});
	} catch(err) {}
});


app.use('/api', require('./routes/api/ProfileCardApi'))
app.use('/api', require('./routes/api/DashboardApi'))