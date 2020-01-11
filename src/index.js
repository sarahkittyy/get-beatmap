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
const rimraf = require('rimraf');

auth().then(() => {

let args = process.argv.slice(2);

function isId(val) {
	return /^[0-9]{1,8}$/.test(val);
}

function isUrl(val) {
	return /^https?:\/\/osu.ppy.sh\/.*$/.test(val);
}

function grabId(val) {
	return val.match(/^https?:\/\/osu.ppy.sh\/beatmapsets\/([0-9]{1,8}).*$/)[1];
}

async function getMap(val) {
	let url;
	let id;

	if(isId(val)) {
		url = `https://osu.ppy.sh/beatmapsets/${id}`
		id = val;
	}
	else if(isUrl(val)) {
		id = grabId(val);
		url = `https://osu.ppy.sh/beatmapsets/${id}`
	}
	else {
		console.error(`${val} is not a valid beatmap.`);
		console.error(`Only urls and song ids are supported.`);
		return;
	}

	console.log(`Downloading ${id}...`);

	if(await fs.exists(path.resolve(osudir, `Songs/${id}`))) {
		await rimraf(path.resolve(osudir, `Songs/${id}`));
	}
	
	await request.get({
		url: url + '/download',
		rejectUnauthorized: true,
		jar,
		headers,
	})
	.pipe(unzipper.Extract({
		path: path.resolve(osudir, `Songs/${id}`),
	}))
	.promise();
	
	return;
}

(async function() {
	for (let id of args) {
		await getMap(id).then(() => {
			console.log(`Finished downloading ${id}...`);
		});
	}
})();

});
