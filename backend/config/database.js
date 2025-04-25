const mongoose = require('mongoose');
const { mongoUri } = require('./index');
module.exports = () => mongoose.connect(mongoUri, {});