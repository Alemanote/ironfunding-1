const express = require('express');
const router  = express.Router();
const passport = require('passport');

router.get('/signup', (req, res) => {
    res.render('authentication/signup');
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/',
  failureRedirect : '/signup'
}));

router.get('/login', (req, res) => {
	res.render('authentication/login');
})

router.post('/login', passport.authenticate('local-login', {
	successRedirect: '/',
	failureRedirect: '/login',
}))

router.post('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
