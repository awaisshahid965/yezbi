const ProfileCard = require('../models/ProfileCard');
const ShortUniqueId = require('short-unique-id');
const fs = require('fs');

const imageFormats = ['jpg', 'png', 'jpeg'];

// module.exports. = async function(req, res) {}

module.exports.userProfileCardCreation = async function(req, res) {
	let { name = '', email = '' } = req.body;
	try {
		if (!name || !email) {
			throw new Error();
		}
		let shortUserId = (new ShortUniqueId({ length: 16 }))();
		const usrProfileCard = new ProfileCard({
			name,
			email,
			shortUserId,
			profileImgUrl: "/profile-images/default-_-_-.webp",
			coverImgUrl: `/cover-images/cover-_-_-.${["webp", "jpg", "png"][Math.round(Math.random() * 2)]}`
		});
		await usrProfileCard.save();
		res.status(200).json({
			profileCreated: true,
			shortLink: `${req.get('host')}/${usrProfileCard.shortUserId}/share`
		})
	} catch(err) {
		res.status(500).json({
			profileCreated: false,
			error: "Failed to save user details. possible reasons: invalid/empty email/name | User Already Exists..."
		});
	}
}

module.exports.userProfileImageData = async function(req, res) {
	if (!req.files) {
		return res.status(400).json({
			fileWritten: false,
			error: "No files were uploaded..."
		});
	}
	let { imageFile } = req.files;
	if (!imageFormats.includes(imageFile.mimetype.split('/')[1].toLowerCase())) {
		return res.status(400).json({
			fileWritten: false,
			error: `Only ${imageFormats.join(', ')} are allowed!`
		});
	}

	let { email = '' } = req.body;
	try {
		if (!email) {
			throw new Error();
		}
		const userProfileCard = await ProfileCard.findOne({
			email
		}).select('profileImgUrl').exec();
		if(!userProfileCard) {
			throw new Error();
		}
		// delete if already has image
		if (userProfileCard.profileImgUrl !== '' && !userProfileCard.profileImgUrl.includes('default-_-_-')) {
			fs.unlink(userProfileCard.profileImgUrl, (err) => {
				if(err) {
					throw err;
				}
			});
		}
		let imgSrc = `public/profile-images/IMG-${email.split('@')[0]}-${(new ShortUniqueId({ length: 10 }))()}.${imageFile.mimetype.split('/')[1]}`;
		fs.writeFile(imgSrc, imageFile.data, async (err, file) => {
			if(err) {
				throw err;
			} else {
				imgSrc = imgSrc.replace('public', '');
				userProfileCard.profileImgUrl = imgSrc;
				await userProfileCard.save();
				res.status(200).json({
					fileWritten: true
				})
			}
		});
	} catch(err) {
		res.status(500).json({
			fileWritten: false,
			error: "Failed to save user profile image! possible reasons: Wrong Email OR File Write Failed...."
		});
	}
}

module.exports.userCoverImageData = async function(req, res) {
	if (!req.files) {
		return res.status(400).json({
			fileWritten: false,
			error: "No files were uploaded..."
		});
	}
	let { imageFile } = req.files;
	if (!imageFormats.includes(imageFile.mimetype.split('/')[1].toLowerCase())) {
		return res.status(400).json({
			fileWritten: false,
			error: `Only ${imageFormats.join(', ')} are allowed!`
		});
	}

	let { email = '' } = req.body;
	try {
		if (!email) {
			throw new Error();
		}
		const userProfileCard = await ProfileCard.findOne({
			email
		}).select('coverImgUrl');
		if(!userProfileCard) {
			throw new Error();
		}
		// delete if already has image
		if (userProfileCard.coverImgUrl !== '' && !userProfileCard.coverImgUrl.includes('cover-_-_-')) {
			fs.unlink(userProfileCard.coverImgUrl, (err) => {
				if(err) {
					throw err;
				}
			});
		}
		let imgSrc = `public/cover-images/IMG-${email.split('@')[0]}-${(new ShortUniqueId({ length: 10 }))()}.${imageFile.mimetype.split('/')[1]}`;
		fs.writeFile(imgSrc, imageFile.data, async (err, file) => {
			if(err) {
				throw err;
			} else {
				imgSrc = imgSrc.replace('public', '');
				userProfileCard.coverImgUrl = imgSrc;
				await userProfileCard.save();
				res.status(200).json({
					fileWritten: true
				})
			}
		});
	} catch(err) {
		res.status(500).json({
			fileWritten: false,
			error: "Failed to save user cover image! possible reasons: Wrong Email OR File Write Failed."
		});
	}
}

// for redux store
module.exports.userProfileData = async function(req, res) {
	let { email = '' } = req.body;
	try {
		if (!email) {
			throw new Error();
		}
		const usrProfileCard = await ProfileCard.findOne({ email }).select('-_id -__v').lean();
		if (!usrProfileCard) {
			throw new Error();
		}
		res.status(200).json({
			data: { ...usrProfileCard }
		});

	} catch(err) {
		res.status(500).json({
			data: null,
			error: "Failed to get data! possible reasons: invalid/empty email | User Profile Card Not Found..."
		});
	}
}

module.exports.storeLink = async function(req, res) {
	let { email = '',
			linkName = '',
			linkType = '',
			linkValue = '',
			isBusiness = false
		} = req.body;
	try {
		if (!email || !linkType || !linkValue) {
			throw new Error();
		}
		if (!linkName) {
			linkName = linkType;
		}
		const usrProfileCard = await ProfileCard.findOne({ email }).select('links premium').exec();
		if (!usrProfileCard) {
			throw new Error();
		}
		if (!usrProfileCard.premium && isBusiness) {
			res.status(500).json({
				linkAdded: false,
				links: null,
				error: "Buy Premium to use Business Links functionality!"
			})
		}
		usrProfileCard.links.push({
			linkName,
			linkType,
			linkValue,
			isBusiness
		});
		await usrProfileCard.save();
		res.status(200).json({
			linkAdded: true,
			links: usrProfileCard.links
		})

	} catch(err) {
		res.status(500).json({
			linkAdded: false,
			links: null,
			error: "Failed to save new link! possible reasons: Invalid email OR empty linkType/linkValue..."
		})
	}
}

module.exports.updateLink = async function(req, res) {
	let {
			email = '',
			linkName = '',
			linkValue = '',
			linkId = '',
			isBusiness = false
		} = req.body;

	try {
		if (!email || !linkId) {
			throw new Error();
		}

		const usrProfileCard = await ProfileCard.findOne({ email, "links._id": linkId }).select('links premium').exec();
		if (!usrProfileCard) {
			throw new Error();
		}

		if (!usrProfileCard.premium && isBusiness) {
			res.status(500).json({
				linkUpdated: false,
				links: null,
				error: "Buy Premium to use Business Links functionality!"
			})
		}

		let currElLink = usrProfileCard.links.id(linkId), businessChanged = false;

		if(currElLink.linkValue === linkValue) {
			linkValue = '';
		}
		if(currElLink.linkName === linkName) {
			linkName = '';
		}

		if(currElLink.isBusiness !== isBusiness) {
			currElLink.isBusiness = isBusiness;
			businessChanged = !businessChanged;
		}
		if(!!linkName) {
			currElLink.linkName = linkName;
		}
		if(!!linkValue) {
			currElLink.linkValue = linkValue;
		}
		if(linkName || linkValue || businessChanged) {
			await usrProfileCard.save();
		}
		res.status(200).json({
			linkUpdated: true,
			links: usrProfileCard.links
		})

	} catch(err) {
		res.status(500).json({
			linkUpdated: false,
			links: null,
			error: "Failed to save new link! possible reasons: Invalid email OR empty linkType/linkValue..."
		});
	}
}


module.exports.updateEditProfile = async function(req, res) {
	let {
			email = '',
			name = '',
			location = '',
			bio = '',
			businessClient = false,
			theme = ''
		} = req.body;

	try {
		if (!email) {
			throw new Error();
		}
		const usrProfileCard = await ProfileCard.findOne({ email }).select('email name location bio businessClient theme premium');
		if (!usrProfileCard) {
			throw new Error();
		}
		if (!usrProfileCard.premium && businessClient) {
			res.status(500).json({
				profileUpdated: false,
				data: null,
				error: "Buy Premium to use Business Links functionality!"
			})
		}
		let businessChanged = false;
		if(usrProfileCard.name === name) { name = ''; }
		if(usrProfileCard.location === location) { location = ''; }
		if(usrProfileCard.bio === bio) { bio = ''; }
		if(usrProfileCard.theme === theme) { theme = ''; }

		if(usrProfileCard.businessClient !== businessClient) {
			usrProfileCard.businessClient = businessClient;
			businessChanged = true;
		}

		if(!!name) { usrProfileCard.name = name; }
		if(!!location) { usrProfileCard.location = location; }
		if(!!bio) { usrProfileCard.bio = bio; }
		if(!!theme) { usrProfileCard.theme = theme; }

		if(name || location || bio || theme || businessChanged) {
			await usrProfileCard.save();
			console.log('testing...');
		}

		res.status(200).json({
			profileUpdated: true,
			data: {
				name,
				location,
				bio,
				theme,
				businessChanged
			}
		});

	} catch(err) {
		res.status(500).json({
			profileUpdated: false,
			data: null,
			error: "Failed to save Edit Details! possible reasons: Invalid email OR No user found..."
		});
	}
}


module.exports.toggleProfileVisibility = async function(req, res) {
	let { toggleVisibility = false } = req.body;
	try {
		const usrProfileCard = await ProfileCard.findOne({ email }).select('private');
		if (!usrProfileCard) {
			throw new Error();
		}
		if(usrProfileCard.private !== toggleVisibility) {
			usrProfileCard.private = toggleVisibility;
			await usrProfileCard.save();
		}
		res.status(200).json({
			private: toggleVisibility
		});

	} catch(err) {
		res.status(500).json({
			private: false,
			error: "Failed to Update Profile Visibility! possible reasons: Invalid email OR no user found..."
		});
	}
}
