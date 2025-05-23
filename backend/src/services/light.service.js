const adafruit = require('../../config/adafruit');

async function setLightValue(value) {
  const resp = await adafruit.post('/feeds/light/data', { value });
  return resp.data;
}

async function setLightMode(mode) {
  console.log("MODE", mode) 
  const resp = await adafruit.post('/feeds/light-mode/data', { value: mode });
  return resp.data;
}

async function fetchLatest(feedKey) {
  const resp = await adafruit.get(`/feeds/${feedKey}/data?limit=1`);
  const d = resp.data[0];
  console.log(d)
  return { value: isNaN(Number(d.value)) ? d.value : Number(d.value),
           timestamp: new Date(d.created_at) };
}

async function getCondition() {
  const light = await fetchLatest('light');
  return light;
}

async function getModeCondition() {
  const mode  = await fetchLatest('light-mode');
  return mode ;
}

async function fetchHistory(page = 1, pageSize = 5) {
  // how many points we need in total to slice out page “page”
  const toFetch = page * pageSize;

  // fetch the most recent `toFetch` values
  const resp = await adafruit.get('/feeds/light/data', {
    params: { limit: toFetch }
  });

  // parse header for total count
  console.log(resp.headers['x-pagination-total'])
  const total = parseInt(resp.headers['x-pagination-total'] || '0', 10);

  // convert data points
  const allPoints = resp.data.map(d => ({
    value:     parseFloat(d.value),
    timestamp: new Date(d.created_at)
  }));

  // slice out just the ones for the requested page
  const start = (page - 1) * pageSize;
  const results = allPoints.slice(start, start + pageSize);

  console.log("COUNT", total)
  return { count: total, results };
}

module.exports = { setLightValue, setLightMode, getCondition, getModeCondition, fetchHistory };
