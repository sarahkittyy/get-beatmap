const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { document } = (new JSDOM('')).window;
global.document = document;
global.window = document.defaultView;

const jar = require('./jar');
const request = require('request-promise-native');
const { auth, headers } = require('./auth');
const { osudir } = require('./config.json');
const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');

auth().then(() => {

let args = process.argv.slice(2);

function isId(val) {
	return /^[0-9]{1,8}$/.test(val);
}

async function getMap(id) {
	if(!isId(id)) {
		console.error(`${id} is not a valid beatmap.`);
		return;
	}

	console.log(`Downloading ${id}...`);

	await request.get({
		url: `https://osu.ppy.sh/beatmapsets/${id}/download`,
		rejectUnauthorized: true,
		jar,
		headers,
	})
	.pipe(unzipper.Extract({
		path: path.resolve(osudir, `Songs/${id}`)
	}));
}

for (let id of args) {
	getMap(id).then(() => {
		console.log(`Finished downloading ${id}...`);
	});
}

});