const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const Extractjwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const config = require('./config');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = user =>{
  return jwt.sign(user,config.secretKey,{expiresIn: 3600});
};

const opts = {};
opts.jwtFromRequest = Extractjwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

//setup the json web token strategy for passport
exports.jwtPassport = passport.use(
  new JwtStrategy(
    opts,
    (jwt_payload, done)=>{
      console.log('JWT payload:', jwt_payload);
      User.findOne({_id: jwt_payload._id})
      .then((user)=>{
        if(user){
          return done(null, user);
        }else{
          return done(null, false);
        }
      }).catch(err => done(err, false));
    }
  )
);

exports.verifyUser = passport.authenticate('jwt', {session: false});
