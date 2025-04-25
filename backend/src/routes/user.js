const router = require('express').Router();
const ctrl   = require('../controllers/user.controller');
const auth   = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Public
router.post('/signup',  ctrl.signup);
router.post('/login',   ctrl.login);
router.post('/refresh', ctrl.refresh);
router.post('/password/reset',         ctrl.requestPasswordReset);
router.post('/password/reset/confirm', ctrl.confirmPasswordReset);

// Protected
router.use(auth);
router.get('/profile/get',           ctrl.getProfile);
router.patch('/profile/update',      ctrl.updateProfile);
router.put('/profile/avatar/upload', upload.single('avatar'), ctrl.uploadAvatar);

module.exports = router;
