const express = require("express");
const User = require("../models/user");
const passport = require("passport");
const authenticate = require('../authenticate');
const cors = require('./cors');
const router = express.Router();



/* GET users listing. */
router.get("/", cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=> {
  User.find()
  .then(users => res.status(200).json(users))
  .catch(err => next(err));
});
router.get('/facebook/token', passport.authenticate('facebook-token',{session: false}), (req, res)=>{
  if(req.user){
    const token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Contnet-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
  }
});
router.post("/signup", cors.corsWithOptions,  (req, res) => {
  const user = new User({ username: req.body.username });
  User.register(user, req.body.password)
    .then(registeredUser => {
      if(req.body.firstname){
        registeredUser.firstname = req.body.firstname;
      }
      if(req.body.lastname){
        registeredUser.lastname = req.body.lastname;
      }
      return registeredUser.save();
    })
    .then(()=>{
      passport.authenticate("local")(req, res, () => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: true, status: "Registration Successful!" });
    });
  })
  .catch(err => {
    res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
  });
});

router.post("/login", cors.corsWithOptions, passport.authenticate("local", {session: false}), (req, res) => {
  const token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({ success: true, token: token, status: "You are successfully logged in!" });
});

router.post('/logout', cors.corsWithOptions, (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
      const token = authHeader.split(' ')[1];
      res.status(200).json({ message: 'Logged out successfully.' });
  } else {
      res.status(400).json({ message: 'No token provided.' });
  }
});
module.exports = router;
