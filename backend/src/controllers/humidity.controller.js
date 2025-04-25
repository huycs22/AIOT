const { boundSchema, recordSchema } = require('../validators/humidity.validator');
const svc = require('../services/humidity.service');

exports.updateBound = async (req, res, next) => {
  try {
    const b = await boundSchema.validateAsync(req.body);
    res.json(await svc.updateBound(b));
  } catch (e) {
    next(e);
  }
};

exports.getBound = async (req, res, next) => {
  try {
    res.json(await svc.getBound());
  } catch (e) {
    next(e);
  }
};

exports.sync = async (req, res, next) => {
  try {
    const r = await recordSchema.validateAsync(req.body);
    res.status(201).json(await svc.syncRecord(r));
  } catch (e) {
    next(e);
  }
};

// src/controllers/humidity.controller.js
exports.getAll = async (req, res, next) => {
  try {
    // 1) Fetch live from Adafruit
    const live = await svc.fetchSensorData(100);
    // 2) For each reading, upsert into Mongo (avoid dupes by timestamp)
    await Promise.all(live.map(d =>
      svc.syncRecord(d).catch(() => {})    // ignore duplicates
    ));
    // 3) Return the live data
    res.json(live);
  } catch (e) {
    next(e);
  }
};

exports.getRecent = async (req, res, next) => {
  try {
    console.log(req.params)
    const n = parseInt(req.params.n) || 10;
    const live = await svc.fetchSensorData(n);
    await Promise.all(live.map(d => svc.syncRecord(d).catch(() => {})));
    res.json(live);
  } catch (e) {
    next(e);
  }
};


exports.deleteAll = async (req, res, next) => {
  try {
    res.json(await svc.deleteAll());
  } catch (e) {
    next(e);
  }
};

exports.deleteOldest = async (req, res, next) => {
  try {
    const n = parseInt(req.query.n) || 1;
    res.json(await svc.deleteOldest(n));
  } catch (e) {
    next(e);
  }
};
