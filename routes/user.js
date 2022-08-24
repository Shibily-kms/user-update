var express = require('express');
var router = express.Router();
const userHelpers = require("../helpers/user-helpers")

// middleware
let validUser = (req, res, next) => {
  if (req.session._USER) {
    next();
  } else {
    res.redirect('/sign-in')
  }
}

/* GET home page. */
router.get('/', validUser, (req, res, next) => {
  let user = req.session._USER
  res.render('user/home', { title: 'Home' ,user});
});

// SignUp 
router.get('/sign-up', (req, res) => {
  if(req.session._USER){
    res.redirect('/');
  }else if (req.session.error) {
    res.render('user/sign-up', { title: "Sign Up", "error": req.session.error })
    req.session.error = false
  } else {
    res.render('user/sign-up', { title: "Sign Up" })

  }
});

router.post('/sign-up', (req, res) => {
  userHelpers.toSingUp(req.body).then((response) => {
    if (response) {
      req.session.error = "This Email already userd"
      res.redirect("/sign-up")
    } else {
      req.session.success = "New account created, Login Now !"
      res.redirect('/sign-in')
    }
  })
});

// Sign In
router.get('/sign-in', (req, res) => {
  if(req.session._USER){
    res.redirect('/');
  }else if (req.session.success) {
    res.render('user/sign-in', { title: "Sign In", "success": req.session.success })
    req.session.success = false
  } else if (req.session.error) {
    res.render('user/sign-in', { title: "Sign In", "error": req.session.error })
    req.session.error = false
  } else {
    res.render('user/sign-in', { title: "Sign In" })
  }
});

router.post('/sign-in', (req, res) => {
  userHelpers.toSingIn(req.body).then((response) => {
    if (response.emailError) {
      req.session.error = "Invalid Email Id"
      res.redirect('/sign-in')
    } else if (response.passwordError) {
      req.session.error = "Invalid password"
      res.redirect('/sign-in')
    } else if (response) {
      req.session._USER = response
      res.redirect('/');
    }
  })
});

// Sign Out

router.get("/sign-out",(req,res)=>{
  req.session._USER = null
  res.redirect("/sign-in")
});



module.exports = router;
