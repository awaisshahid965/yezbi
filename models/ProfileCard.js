const { Schema, model } = require('mongoose');

const profileCardSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  imgSrc: {
    type: String,
    default: ""
  },
  shortUserId: {
    type: String,
    required: true
  },
  premium: {
    type: Boolean,
    default: false
  },
  activeList: [{
    linkName: { type: String },
    showLink: { type: Boolean }
  }],

  // links need to de added
  linkedin: [{
  	type: String
  }],
  facebook: [{
    type: String
  }],
  number: [{
    type: String
  }],
  email: [{
    type: String
  }],
  instagram: [{
    type: String
  }],
  website: [{
    type: String
  }],
  linkedin: [{
    type: String
  }],
  whatsapp: [{
    type: String
  }],
  call: [{
    type: String
  }],
  wechat: [{
    type: String
  }],
  facetimer: [{
    type: String
  }],
  address: [{
    type: String
  }],
  snapchat: [{
    type: String
  }],
  tiktok: [{
    type: String
  }],
  twitter: [{
    type: String
  }],
  youtube: [{
    type: String
  }],
  clubhouse: [{
    type: String
  }],
  twitch: [{
    type: String
  }],
  pinterest: [{
    type: String
  }],
  website: [{
    type: String
  }],
  calendy: [{
    type: String
  }],
  reviews: [{
    type: String
  }],
  etsy: [{
    type: String
  }],
  applink: [{
    type: String
  }],
  booksy: [{
    type: String
  }],
  square: [{
    type: String
  }],
  yelp: [{
    type: String
  }],
  cashapp: [{
    type: String
  }],
  venmo: [{
    type: String
  }],
  zelle: [{
    type: String
  }],
  paypal: [{
    type: String
  }],
  customlink: [{
    type: String
  }],
  linktree: [{
    type: String
  }],
  discord: [{
    type: String
  }],
  onlyfans: [{
    type: String
  }],
  opensea: [{
    type: String
  }],
  podacasts: [{
    type: String
  }],
  hoobe: [{
    type: String
  }],
  spotify: [{
    type: String
  }],
  applemusic: [{
    type: String
  }],
  soundcloud: [{
    type: String
  }],
});

// console.log(Object.keys(profileCardSchema.tree))

const ProfileCard = model('profilecard', profileCardSchema);
module.exports = ProfileCard;

// [
//   'linkedin',    'facebook',   'number',
//   'instagram',   'website',    'whatsapp',
//   'call',        'wechat',     'facetimer',
//   'address',     'snapchat',   'tiktok',
//   'twitter',     'youtube',    'clubhouse',
//   'twitch',      'pinterest',  'calendy',
//   'reviews',     'etsy',       'applink',
//   'booksy',      'square',     'yelp',
//   'cashapp',     'venmo',      'zelle',
//   'paypal',      'customlink', 'linktree',
//   'discord',     'onlyfans',   'opensea',
//   'podacasts',   'hoobe',      'spotify',
//   'applemusic',  'soundcloud'
// ]