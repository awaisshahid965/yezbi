// [
//   'linkedin',    'facebook',   'number',
//   'instagram',   'website',    'whatsapp',
//   'call',        'wechat',     'facetimer',
//   '-address',     'snapchat',   'tiktok',
//   'twitter',     'youtube',    'clubhouse',
//   'twitch',      'pinterest',  '-calendy',
//   '-reviews',     'etsy',       '-applink',
//   '-booksy',      '-square',     'yelp',
//   '-cashapp',     'venmo',      'zelle',
//   'paypal',      'customlink', '-linktree',
//   'discord',     'opensea',	  'email'
//   'podacasts',   '-hoobe',      'spotify',
//   'applemusic',  'soundcloud', 
// ]

const linksAppSupports = {
	"linkedin": {
		icon: '<i class="fa-brands fa-linkedin"></i>',
		hrefType: ""
	},
	"facebook": {
		icon: '<i class="fa-brands fa-facebook-f"></i>',
		hrefType: ""
	},
	"number": {
		icon: '<i class="fa-solid fa-mobile-screen-button"></i>',
		hrefType: "tel:"
	},
	"instagram": {
		icon: '<i class="fa-brands fa-instagram"></i>',
		hrefType: ""
	},
	"website": {
		icon: '<i class="fa-solid fa-link"></i>',
		hrefType: ""
	},
	"whatsapp": {
		icon: '<i class="fa-brands fa-whatsapp"></i>',
		hrefType: ""
	},
	"call": {
		icon: '<i class="fa-solid fa-square-phone"></i>',
		hrefType: "tel:"
	},
	"wechat": {
		icon: '<i class="fa-brands fa-weixin"></i>',
		hrefType: "weixin://dl/chat?"
	},
	"facetimer": {
		icon: '<i class="fa-solid fa-video"></i>',
		hrefType: "facetime:"
	},
	"snapchat": {
		icon: '<i class="fa-brands fa-snapchat"></i>',
		hrefType: ""
	},
	"tiktok": {
		icon: '<i class="fa-brands fa-tiktok"></i>',
		hrefType: ""
	},
	"twitter": {
		icon: '<i class="fa-brands fa-twitter"></i>',
		hrefType: ""
	},
	"youtube": {
		icon: '<i class="fa-brands fa-youtube"></i>',
		hrefType: ""
	},
	"clubhouse": {
		icon: '<i class="fa-solid fa-hand-wave"></i>',
		hrefType: ""
	},
	"twitch": {
		icon: '<i class="fa-brands fa-twitch"></i>',
		hrefType: ""
	},
	"pinterest": {
		icon: '<i class="fa-brands fa-pinterest-p"></i>',
		hrefType: ""
	},
	"etsy": {
		icon: '<i class="fa-brands fa-etsy"></i>',
		hrefType: ""
	},
	"yelp": {
		icon: '<i class="fa-brands fa-yelp"></i>',
		hrefType: ""
	},
	"venmo": {
		icon: '<i class="fa-brands fa-vimeo"></i>',
		hrefType: ""
	},
	"zelle": {
		icon: '<i class="fa-solid fa-z"></i>',
		hrefType: ""
	},
	"paypal": {
		icon: '<i class="fa-brands fa-paypal"></i>',
		hrefType: ""
	},
	"customlink": {
		icon: '<i class="fa-solid fa-link-slash"></i>',
		hrefType: ""
	},
	"discord": {
		icon: '<i class="fa-brands fa-discord"></i>',
		hrefType: ""
	},
	"email": {
		icon: '<i class="fa-solid fa-envelope"></i>',
		hrefType: "mailto:"
	},
	"podacasts": {
		icon: '<i class="fa-duotone fa-podcast"></i>',
		hrefType: ""
	},
	"applemusic": {
		icon: '<i class="fa-brands fa-apple"></i>',
		hrefType: ""
	},
	"spotify": {
		icon: '<i class="fa-brands fa-spotify"></i>',
		hrefType: ""
	},
	"soundcloud": {
		icon: '<i class="fa-brands fa-soundcloud"></i>',
		hrefType: ""
	}
};


module.exports = linksAppSupports;