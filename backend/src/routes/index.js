// src/routes/index.js
const router = require('express').Router();

router.use('/user', require('./user'));

router.use('/fan', require('./fan'));
router.use('/light', require('./light'));

router.use('/humidity', require('./humidity'));
router.use('/temperature', require('./temperature'));
router.use('/brightness', require('./brightness'));


module.exports = router;
