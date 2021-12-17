var express = require('express');
var router = express.Router();

const twofactor = require('node-2fa');
const userService = require('../services/users')();


router.get('/', (req, res) => {
  res.render('home');
})

router.get('/signin', function(req, res, next) {
  res.render('singIn', { title: 'Crear QR', message: req.flash('error') });
});

router.post('/signin', (req, res) => {
  let user = req.body;
  if(userService.checkUser(user.username) == -1) {
    let otp = twofactor.generateSecret({
      name: "CIBERSEGURIDAD-OTP",
      account: user.username,
    });
    userService.createUser({username: user.username, otp: otp.secret});
    res.render('otp', { title: 'OTP', otp: otp});
  } else {
    req.flash('error', 'El usuario ya existe');
    res.redirect('/');
  }
})

router.get('/login', (req, res) => {
  res.render('login', { title: 'Iniciar Sesion', message: req.flash('error') });
})

router.post('/login', (req, res) => {
  let userPost = req.body;
  if(userService.checkUser(userPost.username) == -1) {
    req.flash('error', 'El usuario no existe');
    res.redirect('/login')
  } else {
    let user = userService.getUser(userPost.username);
    let check = twofactor.verifyToken(user.otp, userPost.token);
    if(check == null || check.delta != 0) {
      req.flash('error', 'Error en el OTP');
      res.redirect('/login')
    }
    if(check.delta == 0) {
      res.send('CORRECTO')
    }
  }

})

module.exports = router;
