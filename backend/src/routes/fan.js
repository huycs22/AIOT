const router = require('express').Router();
const ctrl   = require('../controllers/fan.controller');

// send a new intensity value
router.post('/control',       ctrl.setValue);

// update AUTO vs MANUAL mode
router.put( '/control/mode',  ctrl.setMode);

router.get('/condition', ctrl.getCondition);
router.get('/condition/mode', ctrl.getModeCondition);

router.get('/history', ctrl.getHistory);

module.exports = router;
