const { controlModeSchema, recordSchema } = require('../validators/light.validator');
const svc = require('../services/light.service');

// POST /api/light/control  → send intensity
exports.setValue = async (req, res, next) => {
  try {
    console.log(req.body)
    const { value } = await recordSchema.validateAsync(req.body);
    const result = await svc.setLightValue(value);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// PUT /api/light/control/mode  → switch AUTO/MANUAL
exports.setMode = async (req, res, next) => {
  try {
    console.log("HERE", req.body)
    const { manual } = await controlModeSchema.validateAsync(req.body);
    console.log("MANUAL", manual)
    const result = await svc.setLightMode(manual);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err)
  }
};

exports.getCondition = async (req, res, next) => {
  try {
    const cond = await svc.getCondition();
    res.json(cond);
  } catch (err) {
    res.status(400).json("ERROR")
  }
};

exports.getModeCondition = async (req, res, next) => {
  try {
    const cond = await svc.getModeCondition();
    res.json(cond);
  } catch (err) {
    res.status(400).json("ERROR")
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    // parse page & pageSize, with sensible defaults
    const page     = Math.max(1, parseInt(req.query.page)     || 1);
    const pageSize = Math.max(1, parseInt(req.query.pageSize) || 5);

    console.log(page, pageSize)
    const data = await svc.fetchHistory(page, pageSize);
    res.json(data);
  } catch (err) {
    next(err);
  }
};
