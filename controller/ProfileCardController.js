const ProfileCard = require('../models/ProfileCard');
const ShortUniqueId = require('short-unique-id');
const fs = require('fs');



module.exports.userTextData = async function(req, res) {
	let { name = '', email = '' } = req.body;
	try {
		if (!name || !email) {
			throw new Error();
		}
		let shortUserId = (new ShortUniqueId({ length: 16 }))();
		const usrProfileCard = new ProfileCard({
			name,
			email,
			shortUserId
		});
		await usrProfileCard.save();
		res.status(200).json({
			profileCreated: true,
			shortLink: `${req.get('host')}/${usrProfileCard.shortUserId}/share`
		})
	} catch(err) {
		res.status(500).json({
			profileCreated: false,
			error: "Failed to save user details. possible reasons: invalid/empty email OR name || User Already Exists..."
		})
	}
}

module.exports.userImageData = async function(req, res) {
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

	let { email = 'awais12@xyz.com' } = req.body;
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
		let imgSrc = `public/profile-images/IMG-${email.split('@')[0]}-${(new ShortUniqueId({ length: 10 }))()}.${imageFile.mimetype.split('/')[1]}`;
		fs.writeFile(imgSrc, imageFile.data, async (err, file) => {
			if(err) {
				throw err;
			} else {
				userProfileCard.imgSrc = imgSrc;
				await userProfileCard.save();
				res.status(200).json({
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

module.exports.storeLink = async function(req, res) {
	let { email = '', linkType = '', linkAdress = '' } = req.body;
	linkType = linkType.toLowerCase();
	try {
		if (!email || !linkType || !linkAdress) {
			throw new Error();
		}
		const usrProfileCard = await ProfileCard.findOne({ email }).select(`${linkType} activeList premium`);
		if (!usrProfileCard) {
			throw new Error();
		}
		if (!usrProfileCard.premium && usrProfileCard[linkType].length > 0) {
			return res.status(402).json({
				linkAdded: false,
				error: "Buy premium to add more links!"
			});
		}
		usrProfileCard[linkType].push(linkAdress);
		// let index = usrProfileCard.activeList.findIndex(el => el.linkName === linkType);
		if(usrProfileCard.activeList.findIndex(el => el.linkName === linkType) === -1) {
			usrProfileCard.activeList.push({
				linkName: linkType,
				showLink: true
			})
		}
		await usrProfileCard.save();
		return res.status(200).json({
			linkAdded: true
		});
	} catch(err) {
		res.status(500).json({
			linkAdded: false,
			error: "Failed to add link. possible reasons: invalid/empty email, linkType, linkAdded OR No such user found."
		});
	}
}

module.exports.fetchOneTypeLinks = async function(req, res) {
	let { email = '', linkType = '' } = req.body;
	linkType = linkType.toLowerCase();
	try {
		if (!email || !linkType) {
			throw new Error();
		}
		const usrProfileCard = await ProfileCard.findOne({ email }).select(`${linkType} premium`);
		if (!usrProfileCard) {
			throw new Error();
		}
		if(usrProfileCard[linkType].length === 0) {
			return res.status(200).json({
				hasLinks: false,
				linkType,
				links: []
			});
		} else {
			return res.status(200).json({
				hasLinks: true,
				linkType,
				links: usrProfileCard[linkType]
			});
		}
	} catch(err) {
		res.status(500).json({
			hasLinks: false,
			linkType,
			links: [],
			error: "Failed to fetch link. possible reasons: invalid/empty email, linkType OR No user/links found."
		});
	}
}

module.exports.fetchAllLinks = async function(req, res) {
	let { email = '' } = req.body;
	try {
		if (!email) {
			throw new Error();
		}
		const usrProfileCard = await ProfileCard.findOne({ email }).select(`${linkType} premium`);
		if (!usrProfileCard) {
			throw new Error();
		}

		// for()
	} catch(err) {
		res.status(500).json({
			hasLinks: false,
			links: [],
			error: "Failed to fetch links. possible reasons: invalid/empty email OR No user in database found."
		});
	}
}

module.exports.activeLinksList = async function(req, res) {
	let { email = '' } = req.body;
	try {
		if (!email) {
			throw new Error();
		}
		const usrProfileCard = await ProfileCard.findOne({ email }).select('activeList');
		if (!usrProfileCard) {
			throw new Error();
		}
		let linksAdded = [];
		for(let activeListVal of usrProfileCard.activeList) {
			linksAdded.push({
				showLink: activeListVal.showLink,
				linkName: activeListVal.linkName
			});
			// if (activeListVal.showLink) {
			// 	linksVisible.push({
			// 		showLink: activeListVal.showLink,
			// 		linkName: activeListVal.linkName
			// 	});
			// } else {
			// 	linksNotVisible.push({
			// 		showLink: activeListVal.showLink,
			// 		linkName: activeListVal.linkName
			// 	});
			// }
		}
		return res.status(200).json({linksAdded});

	} catch(err) {
		res.status(500).json({
			error: "Failed to fetch active links. possible reasons: invalid/empty email OR No user in database found."
		});
	}
}

module.exports.updateActiveLink = async function(req, res) {
	let { email = '', linkType = '', showLink = false } = req.body;
	try {
		if (!email || !linkType) {
			throw new Error();
		}
		const usrProfileCard = await ProfileCard.findOne({ email }).select('activeList');
		if (!usrProfileCard) {
			throw new Error();
		}
		let index = usrProfileCard.activeList.findIndex(el => el.linkName === linkType);
		if(index === -1) {
			throw new Error();
		} else {
			if(usrProfileCard.activeList[index].showLink !== showLink) {
				usrProfileCard.activeList[index].showLink = showLink;
				await usrProfileCard.save();
			}
		}
		return res.status(200).json({
			changedLinkData: usrProfileCard.activeList[index]
		});

	} catch(err) {
		res.status(500).json({
			changedLinkData: null,
			error: "Failed to fetch active links. possible reasons: invalid/empty email, linkType OR No user in database found."
		});
	}
}


module.exports.deleteLink = async function(req, res) {
	let { email = '', linkType = '' } = req.body;
	try {
		if (!email || !linkType) {
			throw new Error();
		}
		const usrProfileCard = await ProfileCard.findOne({ email }).select(`${linkType} activeList`);
		if (!usrProfileCard) {
			throw new Error();
		}
		usrProfileCard[linkType] = [];
		usrProfileCard.activeList = usrProfileCard.activeList.filter(upd => upd.linkName !== linkType);
		await usrProfileCard.save();
		res.json({
			linkDeleted: true,
			deletedLinkType: linkType,
		})

	} catch(err) {
		console.log(err);
		res.status(500).json({
			linkDeleted: false,
			deletedLinkType: linkType,
			error: "Failed to delete link. possible reasons: invalid/empty email, linkType OR No user in database found."
		});
	}
}