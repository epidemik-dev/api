const get_app = require('./main.js').get_app;
const join = get_app("EPIDEMIK", true);
const app = join[0];
const diagnose = join[2];

diagnose()
