let args = process.argv.slice(2);
let config = require('./config.json');

function getMap(id) {
	console.log(id);
}

console.log(config);
for (let id of args) {
	getMap(id);
}
