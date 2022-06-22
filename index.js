// imports
const express = require('express');
const cors = require('cors');
const fileUpload = require("express-fileupload");
const { connectToDatabase } = require('./config/database.config');
const ProfileCard = require('./models/ProfileCard');


// var setups
const app = express();


// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));
app.use(fileUpload());


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
				location
			} = await ProfileCard.findOne({ shortUserId: sid }).select('');
		// let linksVisible = [];
		// for(let activeListVal of usrProfileCard.activeList) {
		// 	if (activeListVal.showLink) {
		// 		linksVisible.push({
		// 			showLink: activeListVal.showLink,
		// 			linkName: activeListVal.linkName
		// 		});
		// 	}
		// }
		res.render('profile-card', {
			_id,
			name,
			email,
			profileImgUrl,
			coverImgUrl,
			theme,
			location
		});
	} catch(err) {}
});


app.use('/api', require('./routes/api/ProfileCardApi'))