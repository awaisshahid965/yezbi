require('dotenv').config();
const mongoose = require('mongoose');



let dbConnectionVar;
const dbOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true
};


async function connectToDatabase(app) {
	try {
		dbConnectionVar = await mongoose.connect(process.env.dbUri, dbOptions);
		console.log('Database Connected...');
		app.listen(process.env.PORT || process.env.DEV_PORT);
		console.log('Server Listening on Port :' +(process.env.PORT || process.env.DEV_PORT));
	} catch(err) {
		console.log('Failed to connect database...');
		console.log('Either worng dbUri in .env');
		console.log('---------- OR ------------');
		console.log('database service is unavailable (turned off)');
		console.log(err);
	}
}

module.exports = {
	dbConnectionVar,
	connectToDatabase
};