const { Schema, model } = require('mongoose');

const profileCardSchema = new Schema({
  name: {
    type: String
  },
  imgSrc: {
    type: String
  },
  userId: {
    type: String,
    required: true
  },
  shortUserId: {
    type: String,
    required: true
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