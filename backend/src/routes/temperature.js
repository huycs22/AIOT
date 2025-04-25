const router = require('express').Router();
const ctrl = require('../controllers/temperature.controller');

router.patch('/bound/update', ctrl.updateBound);
router.get('/bound/get', ctrl.getBound);
router.post('/record/sync', ctrl.sync);
router.get('/record/get', ctrl.getAll);
router.get('/record/get/:n', ctrl.getRecent);
router.delete('/record/delete', ctrl.deleteAll);
router.delete('/record/delete', ctrl.deleteOldest); // use query n

module.exports = router;