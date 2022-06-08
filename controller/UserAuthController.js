const bcrypt = require('bcrypt');
const ShortUniqueId = require('short-unique-id');

// models imports
const User = require('../models/User');
const ProfileCard = require('../models/ProfileCard');


module.exports.signup = function(req, res) {
	const { email, password } = req.body;

	const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS));
	const hashedPassword = bcrypt.hashSync(password, salt);

	const sId = (new ShortUniqueId({ length: 16 }))();

	try {
		// first create User
		const user = new User({
			email,
			password
		});

		// then an empty Profile Card
		const profileCard = new ProfileCard({
			userId: user._id.toString(),
			shortUserId: sId
		});
		res.json({ user, profileCard })
		// user.save();
	} catch(err) {
		res.json({ err })
	}
}