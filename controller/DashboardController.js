const ProfileCard = require('../models/ProfileCard');


// module.exports.allUserData = async function(req, res) {}

module.exports.allUserData = async function(req, res) {
	let { email } = req.body;
	try {
		const allUserProfileCards = await ProfileCard.find({}).select('email name shortUserId');
		if(!allUserProfileCards) {
			throw new Error();
		}
		return res.status(200).json({
			profileCardsList: allUserProfileCards,
			error: false
		});
	} catch(err) {
		return res.status(500).json({
			profileCardsList: [],
			error: true
		});
	}
}