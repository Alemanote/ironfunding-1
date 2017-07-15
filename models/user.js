const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
  email      : String,
  username   : String,
  password   : String,
  description: String,
  imgUrl     : { type: String, default: "https://placeholdit.imgix.net/~text?txtsize=33&txt=250%C3%97250&w=250&h=250" }
});

UserSchema.statics.create = function(attributes, callback) {
	const User = this;
	const {username, email, description, password} = attributes;
	const hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(8));
	const newUser = new User({
		username,
		email,
		description,
		password: hashPass,
	});
	return newUser.save().then(user => callback(null, user)).catch(error => callback(error))
}

UserSchema.methods.comparePassword = function(candidatePassword) {
	return bcrypt.compareSync(candidatePassword, this.password)
}

const User = mongoose.model('User', UserSchema);
module.exports = User;
