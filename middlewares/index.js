const jwt_decode = require('jwt-decode');



class Middleware {
	decodeToken(req, res, next) {
		const token = req.headers.authorization;
		try {
			if(!token) {
				throw new Error();
			}
			const decodeValue = jwt_decode(token);
			req.email = decodeValue.email;
			next();
		} catch (err) {
			return res.status(401).json({
				isAuthorized: false,
				error: "Please Login to Continue!"
			});
		}
	}

	matchEmail(req, res, next) {
		try {
			if(req.email !== req.body.email) {
				throw new Error();
			}
			next();
		} catch (err) {
			return res.status(403).json({
				isAuthorized: false,
				error: "Email does not match with user who sent request!"
			});
		}
	},
	logRequestPathAndType(req, res, next) {
		console.log(`${req.method.toUpperCase()}: ${req.path}`);
	}
}

module.exports = new Middleware();