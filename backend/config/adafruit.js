const axios = require('axios');
const { adafruit } = require('./index');
module.exports = axios.create({
  baseURL: `https://io.adafruit.com/api/v2/${adafruit.user}`,
  headers: { 'X-AIO-Key': adafruit.key }
});