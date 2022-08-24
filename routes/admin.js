const { response } = require('express');
var express = require('express');
const { Db } = require('mongodb');
var router = express.Router();
const adminHelpers = require('../helpers/admin-helpers')
const userHelpers = require('../helpers/user-helpers')

// Middleware
const validAdmin = (req, res, next) => {
  if (req.session._ADMIN) {
    next();
  } else {
    res.redirect("/admin/sign-in")
  }
}

/* GET admin listing. */
router.get('/', validAdmin, (req, res, next) => {
  let admin = req.session._ADMIN
  res.render('admin/home', { title: "Admin panel", admin })
});

// Sign In 
router.get('/sign-in', (req, res) => {
  if (req.session._ADMIN) {
    res.redirect('/admin');
  } else if (req.session.error) {
    res.render('admin/sign-in', { title: "Admin Sign In", "error": req.session.error })
    req.session.error = false
  } else {
    res.render('admin/sign-in', { title: "Admin Sign In" })
  }

});

router.post('/sign-in', (req, res) => {
  adminHelpers.toSignIn(req.body).then((response) => {
    if (response.emailError) {
      req.session.error = "Invalid Email Id"
      res.redirect('/admin/sign-in')
    } else if (response.passwordError) {
      req.session.error = "Invalid password"
      res.redirect('/admin/sign-in')
    } else if (response) {
      req.session._ADMIN = response
      res.redirect('/admin');
    }
  })
});

// SignOut

router.get("/sign-out", (req, res) => {
  req.session._ADMIN = null
  res.redirect("/admin/sign-in")
});

// User List  - View
router.get('/user-list', validAdmin, (req, res) => {
  adminHelpers.getAllUsers().then((allUsers) => {
    res.render('admin/user-list', { title: "User list | Admin panel", allUsers })
  })
});

// User List - Edit
router.get('/edit-user/:id', validAdmin, (req, res) => {
  let userId = req.params.id
  adminHelpers.getOneUser(userId).then((data) => {
    if (req.session.success) {
      res.render('admin/edit-user', { title: "Edit user | Admin panel", data, "success": req.session.success })
      req.session.success = false
    } else {
      res.render('admin/edit-user', { title: "Edit user | Admin panel", data })
    }
  })
});

router.post('/edit-user/:id', validAdmin, (req, res) => {
  let id = req.params.id
  req.body.id = id
  adminHelpers.editUserData(req.body).then((response) => {
    req.session.success = "Successfully changed"
    res.redirect('/admin/edit-user/' + id)

  })
})


// User List - Remove
router.get('/remove-user/:id', validAdmin, (req, res) => {
  let userId = req.params.id
  adminHelpers.removeOneUser(userId).then(() => {
    res.redirect('/admin/user-list')
  })
});

// User List - add User
router.get('/add-user', validAdmin, (req, res) => {
  if (req.session.success) {
    res.render('admin/add-user', { title: "Add user | Admin panel", "success": req.session.success })
    req.session.success = false
  } else if (req.session.error) {
    res.render('admin/add-user', { title: "Add user | Admin panel", "error": req.session.error })
    req.session.error = false
  } else {
    res.render('admin/add-user', { title: "Add user | Admin panel" })
  }
});

router.post('/add-user', validAdmin, (req, res) => {
  userHelpers.toSingUp(req.body).then((response) => {
    if (response) {
      req.session.error = "This Email already userd"
      res.redirect('/admin/add-user');
    } else {
      req.session.success = "New user created"
      res.redirect('/admin/add-user')
    }
  })
})




module.exports = router;
