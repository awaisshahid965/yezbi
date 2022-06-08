/single-link-save (linkType, Value)
/retrun-single-link 

/profile-pic-save
/profile-pic-update

/save-user-name (name, email)

/return-all-links



Endpoints = {
	"/api/store/data/text": {
		useCase: "When ask username, submit it to this endpoint with email",
		requestVar: { email, password },
		response: { profileCreated: true/false },
		resultantChanges: "This Route causes to create user profile card with its unique link"
	}
}