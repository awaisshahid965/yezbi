const { Schema, model } = require('mongoose');

const linksSchema = new Schema({
  linkName: { type: String },
  linkType: { type: String },
  linkValue: { type: String },
  visibleOnProfile: { type: Boolean, default: true },
  isBusiness: { type: Boolean, default: false },
  clickCount: { type: Number, default: 0 }
});

const connectionSchema = new Schema({
  name: { type: String, default: '' },
  email: { type: String , default: ''},
  number: { type: String, default: '' },
  website: { type: String, default: '' },
  jobTitle: { type: String, default: '' },
  company: { type: String, default: '' },
  note: { type: String, default: '' },
  imgUrl: { type: String, default: '' }
});

const profileCardSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  profileImgUrl: {
    type: String
  },
  coverImgUrl: {
    type: String
  },
  shortUserId: {
    type: String,
    required: true
  },
  premium: {
    type: Boolean,
    default: false
  },
  businessClient: {
    type: Boolean,
    default: false
  },
  private: {
    type: Boolean,
    default: false
  },
  leadCapture: {
    type: Boolean,
    default: false
  },
  theme: {
    type: String,
    default: '#3e4e55' //#09898f
  },
  location: {
    type: String,
    default: ""
  },
  bio: {
    type: String,
    default: ""
  },
  links: {
    type: [linksSchema]
  },
  connections: {
    type: [connectionSchema]
  }
});

const ProfileCard = model('profilecard', profileCardSchema);
module.exports = ProfileCard;


/*
name,
email,
ph,
address,

*/