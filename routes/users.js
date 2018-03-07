const express   = require('express');
const router    = express.Router();
const userCont  = require('../controller/user_controller');


router.post('/register_user', userCont.registerUser);

module.exports = router;
