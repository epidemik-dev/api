const get_app = require('./main.js').get_app;
const join = get_app("EPIDEMIK");
const app = join[0];
const reset = join[1];

reset();
