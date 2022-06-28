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

module.exports.updateEditProfileObselete = async function(req, res) {
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
	let { toggleVisibility = false, email = '' } = req.body;
	try {
		if (!email) {
			throw new Error();
		}
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

module.exports.toggleLinkVisibility = async function(req, res) {
	let { toggleVisibility = false, linkId = '', email = '' } = req.body;
	try {
		if (!email || !linkId) {
			throw new Error();
		}
		const usrProfileCard = await ProfileCard.findOne({ email }).select('links');
		if (!usrProfileCard) {
			throw new Error();
		}
		if(usrProfileCard.links.id(linkId).visibleOnProfile !== toggleVisibility) {
			usrProfileCard.links.id(linkId).visibleOnProfile = toggleVisibility;
			await usrProfileCard.save();
		}
		res.status(200).json({
			links: usrProfileCard.links
		});

	} catch(err) {
		res.status(500).json({
			links: null,
			error: "Failed to Update Link Visibility! possible reasons: Invalid email OR no user found..."
		});
	}
}

module.exports.deleteLink = async function(req, res) {
	let { linkId = '', email = '' } = req.body;
	try {
		if (!email || !linkId) {
			throw new Error();
		}
		const usrProfileCard = await ProfileCard.findOne({ email }).select('links');
		if (!usrProfileCard) {
			throw new Error();
		}
		usrProfileCard.links.id(linkId).remove();
		await usrProfileCard.save();
		res.status(200).json({
			linkDeleted: true,
			links: usrProfileCard.links
		});

	} catch(err) {
		res.status(500).json({
			linkDeleted: false,
			links: null,
			error: "Failed to Delete Link! possible reasons: Invalid email/link-id OR no user found..."
		});
	}
}

module.exports.updateEditProfile = async function(req, res) {
	let {
			email,
			name,
			location,
			bio,
			businessClient,
			theme,
		} = req.body;
		console.log(req.body)
		console.log(name, email, location, bio, businessClient, theme, 13)

		let {
			profileImage = null,
			coverImage = null
		} = req.files || {};

		businessClient = (businessClient === 'false' || !businessClient) ? false : true;
		console.log(businessClient, 12);

	try {
		if (!email) {
			throw new Error();
		}
		const usrProfileCard = await ProfileCard.findOne({ email }).select('-links');
		if (!usrProfileCard) {
			throw new Error();
		}
		// business client is only available in premium
		if (!usrProfileCard.premium && businessClient) {
			return res.status(500).json({
				profileUpdated: false,
				data: null,
				error: "Buy Premium to use Business Links functionality!"
			});
		}
		if (!usrProfileCard.premium && !!theme) {
			return res.status(500).json({
				profileUpdated: false,
				data: null,
				error: "Buy Premium to use Themes functionality!"
			});
		}

		/*
			** images data checks to see if files received or not
			** if received, delete old one and replace with new file
			** reason this placed above "textual data checks" is
			** if file handeling throws some error, we have less
			** checks to deal with
		*/

		// first we have mimetypes checks so no one upload file other than in format list

		if(!!profileImage) {
			if (!imageFormats.includes(profileImage.mimetype.split('/')[1].toLowerCase())) {
				throw new Error();
			}
		}
		if(!!coverImage) {
			if (!imageFormats.includes(coverImage.mimetype.split('/')[1].toLowerCase())) {
				throw new Error();
			}
		}

		if(!!profileImage) {
			// delete already uploaded image
			if (usrProfileCard.profileImgUrl !== '' && !usrProfileCard.profileImgUrl.includes('default-_-_-')) {
				fs.unlink('public' +usrProfileCard.profileImgUrl, (err) => {
					if(err) {
						throw err;
					}
				});
			}
			// save new image
			let imgSrc = `public/profile-images/IMG-${email.split('@')[0]}-${(new ShortUniqueId({ length: 10 }))()}.${profileImage.mimetype.split('/')[1]}`;
			fs.writeFileSync(imgSrc, profileImage.data);
			imgSrc = imgSrc.replace('public', '');
			usrProfileCard.profileImgUrl = imgSrc;
			console.log(imgSrc)
		}

		if(!!coverImage) {
			// delete already uploaded image
			if (usrProfileCard.coverImgUrl !== '' && !usrProfileCard.coverImgUrl.includes('cover-_-_-')) {
				fs.unlink('public' +usrProfileCard.coverImgUrl, (err) => {
					if(err) {
						throw err;
					}
				});
			}
			// save new image
			let imgSrc = `public/cover-images/IMG-${email.split('@')[0]}-${(new ShortUniqueId({ length: 10 }))()}.${coverImage.mimetype.split('/')[1]}`;
			fs.writeFileSync(imgSrc, coverImage.data);
			imgSrc = imgSrc.replace('public', '');
			usrProfileCard.coverImgUrl = imgSrc;
			console.log(imgSrc);
		}

		/*
			** textual data checks
			** reason of all conditions written below
			** to only change field in database if field has
			** received a value plus that does not match
			** with already saved value
		*/
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
		/*
			** textual data checks end
		*/

		if(name || location || bio || theme || businessChanged || profileImage || coverImage) {
			await usrProfileCard.save();
		}

		res.status(200).json({
			profileUpdated: true,
			data: {
				name,
				location,
				bio,
				theme,
				businessChanged,
				profileImgUrl: usrProfileCard.profileImgUrl,
				coverImgUrl: usrProfileCard.coverImgUrl
			}
		});

	} catch(err) {
		console.log('a', err)
		res.status(500).json({
			profileUpdated: false,
			data: null,
			error: "Failed to save Edit Details! possible reasons: Invalid email OR No user found OR error during file handling (Wrong mimetype OR Save operation failed. allowed mimetype "+ imageFormats.join(', ') +")."
		});
	}
}

module.exports.addConnection = async function(req, res) {
	let {
		id = '',
		name = '',
		email = '',
		number = '',
		jobTitle = '',
		company = '',
		note = '',
		existing_user = false
	} = req.body;

	// res.json({ ...req.body });
	existing_user = (existing_user === 'false' || !existing_user) ? false : true;

	let errors = [];

	try {
		// here
		if(!id) {
			errors.push("Warning! Don't remove ID attribute.")
			throw new Error();
		}
		if(!email) {
			errors.push("Email is required!")
			throw new Error();
		}
		const usrProfileCard = await ProfileCard.findById(id).select('connections profileImgUrl email name shortUserId');
		if(!usrProfileCard) {
			errors.push("No such user found in Database!");
			errors.push("User may be deleted or removed!");
			throw new Error();
		}
		// making vCard
		if(existing_user) {
			let existingUserData = await ProfileCard.findOne({ email });
			if(!existingUserData) {
				return res.status(404).send("No User found...");
			}
			usrProfileCard.connections.push({
				name: existingUserData.name,
				email: existingUserData.email,
				imgUrl: existingUserData.profileImgUrl
			});
		} else {
			usrProfileCard.connections.push({
				name,
				email,
				number,
				jobTitle,
				company,
				note,
				imgUrl: ''
			});
		};

		await usrProfileCard.save();
		// now user is in your connection, send him your vCard too...
		let { vCard, contentType, contentDisposition } = makeVcard(usrProfileCard.name, usrProfileCard.email, '', `${req.get('host')}${usrProfileCard.profileImgUrl}`, '', '', '', `${req.get('host')}/${usrProfileCard.shortUserId}/share`);

		// set returned headers to response
		res.set('Content-Type', contentType);
		res.set('Content-Disposition', contentDisposition);
		res.send(vCard);

	} catch(err) {
		res.status(500).json({
			errors
		});
	}
}

module.exports.deleteConnection = async function(req, res) {
	let { connectionId = '', email = '' } = req.body;
	try {
		if (!email || !connectionId) {
			throw new Error();
		}
		const usrProfileCard = await ProfileCard.findOne({ email }).select('connections');
		if (!usrProfileCard) {
			throw new Error();
		}
		usrProfileCard.connections.id(connectionId).remove();
		await usrProfileCard.save();
		res.status(200).json({
			connectionDeleted: true,
			connection: usrProfileCard.connections
		});

	} catch(err) {
		console.log(err)
		res.status(500).json({
			connectionDeleted: false,
			connection: null,
			error: "Failed to Delete Connection! possible reasons: Invalid email/connection-id OR no user found..."
		});
	}
}

module.exports.getConnection = async function(req, res) {
	let { email = '' } = req.body; 
	try {
		if (!email) {
			throw new Error();
		}
		const usrProfileCard = await ProfileCard.findOne({ email }).select('-_id connections').lean();
		if (!usrProfileCard) {
			throw new Error();
		}
		res.status(200).json({
			connections: usrProfileCard.connections
		});

	} catch(err) {
		res.status(500).json({
			connections: null,
			error: "Failed to get data! possible reasons: User Profile Card Not Found..."
		});
	}
}

// makeVcard(vCard, name, email, null, `${req.get('host')}${profileImgUrl}`, null, null, null)
// makeVcard(vCard, name, email, number, null, company, jobTitle, note);