var express = require('express');
var router = express.Router();
var { signUp , logIn , logOut , profile , getUsers , updateUser , deleteUser , getUserPosts } = require('../controllers/userController')
var { isAuthenticated } = require('../middlewares/isAuthenticated')
var { isAdmin } = require('../middlewares/isAdmin')
var { isOwner } = require('../middlewares/isOwner');

router.post('/signup' , signUp)
router.post('/login' , logIn)
router.post('/logout' , isAuthenticated , logOut)
router.get('/' , isAuthenticated , isAdmin , getUsers)
router.get('/posts' , isAuthenticated , getUserPosts)
router.put('/update/:id' , isAuthenticated , isOwner , updateUser)
router.get('/:id' , isAuthenticated , isOwner, profile)
router.delete('/:id' , isAuthenticated , isAdmin , deleteUser)

module.exports = router






























// var express = require("express");
// var router = express.Router();
// var models = require("../models");
// const { Op } = require("sequelize");

// /* GET users listing. */
// router.get("/", function(req, res, next) {
//   res.send("respond with a resource");
// });

// router.post("/signup", (req, res) => {
//   let { username, firstname, lastname, email, admin, password } = req.body;
//   if (!username || !firstname || !lastname || !email || !admin || !password) {
//     return res
//       .status(422)
//       .send(
//         "username, firstname, lastname, email, admin and password are required in the req body"
//       );
//   }
//   models.users
//     .findOrCreate({
//       where: {
//         username,
//         email,
//         admin
//       },
//       defaults: {
//         firstname,
//         lastname,
//         email,
//         password,
//         username
//       }
//     })
//     .spread((result, created) => {
//       if (created) {
//         return res.send("User successfully created");
//       } else {
//         return res.send("This user already exists");
//       }
//     });
// });

// router.post("/login", (req, res, next) => {
//   let { usernameoremail, password } = req.body;
//   if (!usernameoremail || !password) {
//     return res
//       .status(422)
//       .send("email or username and password are required in the req body");
//   }
//   console.log(usernameoremail, password);
//   models.users
//     .findOne({
//       where: {
//         [Op.or]: [{ email: usernameoremail }, { username: usernameoremail }]
//       }
//     })
//     .then(user => {
//       if (!user) {
//         console.log("User not found");
//         return res.status(401).json({
//           message: "incorrect credentials"
//         });
//       }
//       res.send(user);
//     })
//     .catch(err => {
//       console.log(err);
//       return res.send(err);
//     });
// });


// router.get('/profile/:id', (req, res, next) => {
//   models.users
//     .findByPk(parseInt(req.params.id))
//     .then(user => {
//       if (user) {
//         res.render('profile', {
//           firstname: user.firstname,
//           lastname: user.lastname,
//           email: user.email,
//           username: user.username
//         });
//       } else {
//         res.send('User not found');
//       }
//     });
//   });

// module.exports = router;
