const mongoose = require('mongoose');
const humidityRecordSchema = new mongoose.Schema({
  value: Number,
  timestamp: { type: Date, default: Date.now }
});
humidityRecordSchema.index({ timestamp: 1 }, { unique: true });

module.exports = mongoose.model('TemperatureRecord', humidityRecordSchema);
