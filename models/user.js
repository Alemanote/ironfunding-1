const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//constants
const DEFAULT_IMG_URL = 'https://placeholdit.imgix.net/~text?txtsize=33&txt=250%C3%97250&w=250&h=250'

const UserSchema = new Schema({
	username: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	email: {type: String, required: true, unique: true},
	description: String,
	imgUrl: {type: String, default: DEFAULT_IMG_URL},
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
