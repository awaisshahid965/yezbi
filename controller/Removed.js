module.exports.userShareLink = async function(req, res) {
	let { email = '' } = req.body;
	try {
		if (!email) {
			throw new Error();
		}
		const usrProfileCard = await ProfileCard.findOne({ email }).select('shortUserId -_id');
		if (!usrProfileCard) {
			throw new Error();
		}
		res.status(200).json({
			sharelink: `${req.get('host')}/${usrProfileCard.shortUserId}/share`
		});

	} catch(err) {
		res.status(500).json({
			sharelink: null,
			error: "Failed to get share link. possible reasons: invalid/empty email | User Not Found..."
		});
	}
}

module.exports.userDetails = async function(req, res) {
	let { email = '' } = req.body;
	try {
		if (!email) {
			throw new Error();
		}
		const usrProfileCard = await ProfileCard.findOne({ email }).select('name profileImgUrl coverImgUrl links leadCapture');
		if (!usrProfileCard) {
			throw new Error();
		}
		let { name, imgSrc } = usrProfileCard;
		res.json({
			userDetails: {
				name: usrProfileCard.name,
				imageUrl: `${!imgSrc ? '' : req.get('host')}${imgSrc.replace('public', '')}`
			}
		})
	} catch(err) {
		res.status(500).json({
			userDetails: null,
			error: "No Data Found! possible errors: wrong email OR no such user in database..."
		})
	}
}

module.exports.userDetailsForEditProfile = async function(req, res) {
	let { email = '' } = req.body;
	try {
		if (!email) {
			throw new Error();
		}
		const usrProfileCard = await ProfileCard.findOne({ email }).select('name profileImgUrl coverImgUrl bio address location theme');
		if (!usrProfileCard) {
			throw new Error();
		}
		let { name, imgSrc } = usrProfileCard;
		res.json({
			userDetails: {
				name: usrProfileCard.name,
				imageUrl: `${!imgSrc ? '' : req.get('host')}${imgSrc.replace('public', '')}`
			}
		})
	} catch(err) {
		res.status(500).json({
			userDetails: null,
			error: "No Data Found! possible errors: wrong email OR no such user in database..."
		})
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

module.exports.updateLink = async function(req, res) {
	let { email = '', linkType = '', linksArray = [] } = req.body;
	try {
		if(!email || !linkType || !linksArray.length || !Array.isArray(linksArray)) {
			throw new Error();
		}
		const usrProfileCard = await ProfileCard.findOne({ email }).select(`${linkType} premium`);
		if(!usrProfileCard) {
			throw new Error();
		}
		if(!usrProfileCard.premium && linksArray.length > 1) {
			return res.json({
				linkUpdated: false,
				updatedLinkType: linkType,
				error: "Not Premium User! Only one link in array allowed..."
			});
		}
		if(usrProfileCard[linkType].length === 0) {
			return res.json({
				linkUpdated: false,
				updatedLinkType: linkType,
				error: "This Link is not added by user..."
			});
		}

		usrProfileCard[linkType] = linksArray;
		await usrProfileCard.save();

		res.json({
			linkUpdated: true,
			updatedLinkType: linkType,
		});

	} catch(err) {
		console.log(err);
		res.status(500).json({
			linkUpdated: false,
			updatedLinkType: linkType,
			error: "Failed to update link. possible reasons: invalid/empty email, linkType, linksArray OR No user in database found."
		});
	}
}