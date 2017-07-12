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
module.exports = router;
