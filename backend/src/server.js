const app = require('./app');
const connectDB = require('../config/database');
const { port } = require('../config/index');

connectDB().then(() => {
  console.log('MongoDB connected');
  app.listen(port, () => console.log(`Server on port ${port}`));
});