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
  linkedin: [{
  	type: String
  }],
  facebook: [{
    type: String
  }]
});

const ProfileCard = model('profilecard', profileCardSchema);
module.exports = ProfileCard;