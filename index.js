// imports
const express = require('express');
const cors = require('cors');
const fileUpload = require("express-fileupload");
const { connectToDatabase } = require('./config/database.config');
const ProfileCard = require('./models/ProfileCard');


// var setups
const app = express();


// middlewares
app.use(cors());
app.use(express.static('public'));
app.use(fileUpload());
app.use(express.json());


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

app.get('/:sid/share', async (req, res) => {
	let { sid } = req.params;
	try {
		const usrProfileCard = await ProfileCard.findOne({ shortUserId: sid }).select('name email activeList');
		let linksVisible = [];
		for(let activeListVal of usrProfileCard.activeList) {
			if (activeListVal.showLink) {
				linksVisible.push({
					showLink: activeListVal.showLink,
					linkName: activeListVal.linkName
				});
			}
		}
		res.render('profile-card', {
			linksVisible,
			name: usrProfileCard.name,
			email: usrProfileCard.email
		});
	} catch(err) {}
});


app.use('/api', require('./routes/api/ProfileCardApi'))