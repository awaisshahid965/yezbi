// imports
const express = require('express');
const { connectToDatabase } = require('./config/database.config');


// var setups
const app = express();


// middlewares
app.use(express.static('public'));
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