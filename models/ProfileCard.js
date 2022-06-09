const { Schema, model } = require('mongoose');

function ActiveLink(n, l) {
  this.linkName = n;
  this.link = l;
}

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
  }],
  activeList: [{
    linkName: { type: String },
    showLink: { type: Boolean }
  }]
});

const ProfileCard = model('profilecard', profileCardSchema);
module.exports = ProfileCard;