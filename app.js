const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const LocalStrategy      = require('passport-local').Strategy;
const User               = require('./models/user');
const bcrypt             = require('bcrypt');

const index = require('./routes/index');
const authRoutes = require('./routes/authentication');

const app = express();
mongoose.connect('mongodb://localhost:27017/ironfunds-development');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main-layout');
app.use(expressLayouts);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
	secret: 'ironfundingdev',
	resave: false,
	saveUninitialized: true,
  store: new MongoStore( { mongooseConnection: mongoose.connection })
}));

passport.serializeUser((user, callback) => {
  return callback(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

passport.use('local-signup', new LocalStrategy({passReqToCallback: true},
	(req, username, password, next) => {
			User.findOne({username}, (err, user) => {
				if (err) return next(err)
				if (user) return next(null, false, {message: 'User already exist'})
				const {username, email, description, password} = req.body;
				const hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(8));
				const newUser = new User({
					username,
					email,
					description,
					password: hashPass,
				});
				return newUser.save().then(user => next(null, user)).catch(error => next(error))
			})
	}
))

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components/')))

app.use('/', index);
app.use('/', authRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
