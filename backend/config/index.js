require('dotenv').config();
module.exports = {
  port: process.env.PORT,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  adafruit: {
    user: process.env.ADAFRUIT_IO_USERNAME,
    key: process.env.ADAFRUIT_IO_KEY
  },
  mqttUrl: process.env.MQTT_BROKER_URL
};