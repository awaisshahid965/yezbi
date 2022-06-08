const ProfileCard = require('../models/ProfileCard');
const ShortUniqueId = require('short-unique-id');
const fs = require('fs');
// const path = require("path");



module.exports.userTextData = async function (req, res) {
	let { name, email } = req.body;
	try {
		let shortUserId = (new ShortUniqueId({ length: 16 }))();
		const usrProfileCard = new ProfileCard({
			name,
			email,
			shortUserId
		});
		await usrProfileCard.save();
		res.status(201).json({
			profileCreated: true
		})
	} catch(err) {
		res.status(500).json({
			profileCreated: false,
			error: "Failed to save user details. Internal Server Error!"
		})
	}
}

module.exports.userImageData = async function (req, res) {
	if (!req.files) {
		return res.status(400).json({
			fileWritten: false,
			error: "No files were uploaded..."
		});
	}
	let { imageFile } = req.files;
	let imageFormats = ['jpg', 'png', 'jpeg'];
	if (!imageFormats.includes(imageFile.mimetype.split('/')[1].toLowerCase())) {
		return res.status(400).json({
			fileWritten: false,
			error: `Only ${imageFormats.join(', ')} are allowed!`
		});
	}

	let { email = 'awais123@xyz.com' } = req.body;
	try {
		const userProfileCard = await ProfileCard.findOne({
			email
		}).select('imgSrc');
		if(!userProfileCard) {
			throw new Error();
		}
		// delete if already has image
		if (userProfileCard.imgSrc !== '') {
			fs.unlink(userProfileCard.imgSrc, (err) => {
				if(err) {
					throw err;
				}
			});
		}
		let imgSrc = `public/IMG-${email.split('@')[0]}-${(new ShortUniqueId({ length: 10 }))()}.${imageFile.mimetype.split('/')[1]}`;
		fs.writeFile(imgSrc, imageFile.data, async (err, file) => {
			if(err) {
				throw err;
			} else {
				userProfileCard.imgSrc = imgSrc;
				await userProfileCard.save();
				res.status(201).json({
					fileWritten: true
				})
			}
		});
	} catch(err) {
		res.status(500).json({
			fileWritten: false,
			error: "Failed to save user image! possible reasons: Wrong Email OR File Write Failed."
		});
	}
}

module.exports.storeLink = async function (req, res) {
	let { email, linkType, linkAdress } = req.body;
	linkType = linkType.toLowerCase();
	try {
		const usrProfileCard = await ProfileCard.findOne({ email }).select(`${linkType} premium`);
		if (!email) {
			throw new Error();
		}
		// if (!usrProfileCard.premium && )
		console.log(usrProfileCard[linkType])
		res.end()
		// usrProfileCard[linkType] = [...usrProfileCard[linkType], linkAdress];
		// await usrProfileCard.save();
		// res.status(201).json({
		// 	linkAdded: true,
		// 	linkType
		// });
	} catch(err) {
		res.status(500).json({
			linkAdded: false,
			linkType,
			error: "Failed to save user link! possible reasons: No User Found OR Database write Error."
		});
	}
}

// 'awais123@xyz.com'

// {
// 	"email": "awais123@xyz.com",
// 	"linkType": "linkedIn",
// 	"linkAdress": ".../.../.../.../"
// }