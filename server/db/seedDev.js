const db = require('./db.js');
const fs = require('fs');

const seeds = fs.readFileSync(__dirname + '/database.sql').toString();

db.query(seeds, () => console.log('Dev database seeded'));