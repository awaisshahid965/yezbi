const ProfileCard = require('../models/ProfileCard');
const vCardsJS = require('vcards-js');
const ShortUniqueId = require('short-unique-id');




function makeVcard(name, email, number, img, company, jobTitle, note, website) {
	let vCard = vCardsJS();
	let [ fName = '', mName = '', lName = '' ] = name.split(' ');
	vCard.firstName = fName;
	vCard.middleName = mName;
	vCard.lastName = lName;
	vCard.email = email;
	!!img && vCard.photo.attachFromUrl(img, img.slice(img.length - 5, img.length).split('.')[1]);
	!!company && (vCard.organization = company);
	!!number && (vCard.workPhone = number);
	!!jobTitle && (vCard.title = jobTitle);
	!!note && (vCard.note = note);vCard.url
	!!website && (vCard.url = website);

	// from here, vCard + two headers returned for creating vCard file...
	const sid = (new ShortUniqueId({ length: 10 }))();
	return {
		vCard: vCard.getFormattedString(),
		contentDisposition: `inline; filename="${sid}.vcf"`,
		contentType: `text/vcard; name="${sid}.vcf"`
	};
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
		console.log(err)
		res.status(500).json({
			errors
		});
	}
}