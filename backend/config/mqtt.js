const mqtt = require('mqtt');
const { mqttUrl } = require('./index');
const client = mqtt.connect(mqttUrl);
module.exports = client;