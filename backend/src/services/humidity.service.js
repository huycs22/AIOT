const adafruit = require('../../config/adafruit');
const Threshold = require('../models/humidityBound.model');
const Record = require('../models/humidityRecord.model');

// Fetch from Adafruit IO
async function fetchSensorData(limit = 10) {
  const resp = await adafruit.get(`/feeds/humidity/data?limit=${limit}`);
  return resp.data.map(d => ({
    value: parseFloat(d.value),
    timestamp: new Date(d.created_at)
  }));
}

// Sync one record to DB
async function syncRecord({ value }) {
  return await Record.create({ value });
}

// Get all records
async function getRecords() {
  return await Record.find().sort({ timestamp: -1 });
}

// Get recent N
async function getRecent(n = 10) {
  return await Record.find().sort({ timestamp: -1 }).limit(n);
}

// Delete all
async function deleteAll() {
  return await Record.deleteMany({});
}

// Delete oldest N
async function deleteOldest(n = 1) {
  const docs = await Record.find().sort({ timestamp: 1 }).limit(n);
  const ids = docs.map(d => d._id);
  return await Record.deleteMany({ _id: { $in: ids } });
}

// Get threshold and init if none
async function getBound() {
  let t = await Threshold.findOne();
  if (!t) {
    t = await Threshold.create({ min: 0, max: 100 });
    await adafruit.post(`/feeds/humidity-threshold/data`, {
      value: JSON.stringify({ min: t.min, max: t.max })
    });
  }
  return t;
}

// Update threshold and sync to Adafruit IO
async function updateBound(data) {
  const updated = await Threshold.findOneAndUpdate({}, data, {
    upsert: true,
    new: true,
    runValidators: true
  });
  await adafruit.post(`/feeds/humidity-threshold/data`, {
    value: JSON.stringify({ min: updated.min, max: updated.max })
  });
  return updated;
}

module.exports = {
  fetchSensorData,
  syncRecord,
  getRecords,
  getRecent,
  deleteAll,
  deleteOldest,
  getBound,
  updateBound
};
