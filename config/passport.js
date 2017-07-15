const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

function config() {
	passport.serializeUser(serializeUser);
	passport.deserializeUser(deserializeUser);

	const localOptions = {passReqToCallback: true}
	passport.use('local-signup', new LocalStrategy(localOptions, localSignup))
	passport.use('local-login', new LocalStrategy(localOptions, localLogin))
	return passport
}

function serializeUser(user, callback) {
	return callback(null, user.id);
}

function deserializeUser(id, callback) {
	return User.findById(id, (error, user) => {
		if (error) return callback(error);
		callback(null, user);
	});
}

function localSignup(req, username, password, next) {
	User.findOne({username}, (err, user) => {
		if (err) return next(err)
		if (user) return next(null, false, {message: 'User already exist'})
		User.create(req.body, next)
	})
}

function localLogin(req, username, password, next) {
	User.findOne({ username }, (error, user) => {
	 if (error) {
		 return next(error);
	 }
	 if (!user) {
		 return next(null, false, { message: "Incorrect username" });
	 }
	 if (!user.comparePassword(password)) {
		 return next(null, false, { message: "Incorrect password" });
	 }
	 return next(null, user);
	});
}

module.exports = config
