const mongoose = require('mongoose');
const humidityBoundSchema = new mongoose.Schema({
  min: { type: Number, required: true },
  max: { type: Number, required: true }
});
module.exports = mongoose.model('BrightnessBound', humidityBoundSchema);
