// imports
const express = require('express');
const cors = require('cors');
const fileUpload = require("express-fileupload");
const { connectToDatabase } = require('./config/database.config');


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


app.use('/api', require('./routes/api/UserAuthApi'))
app.use('/api', require('./routes/api/ProfileCardApi'))