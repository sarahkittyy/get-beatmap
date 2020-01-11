const request = require('request-promise-native');
const config = require('./config.json');
const $ = require('jquery');
const jar = require('./jar');

const headers = {
	'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:66.0) Gecko/20100101 Firefox/66.0',
	'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
	'Accept-Language': 'en-US,en;q=0.5',
	'Connection': 'keep-alive'
};

async function auth() {
	let token;
	let { username, password } = config;
	
	console.log('Fetching token...');
	
	let tok_res = await request.get({
		url: 'https://osu.ppy.sh/home',
		headers
	});
	var $el = $('<div></div>');
	$el.html(tok_res);
	token = $('input[name="_token"]', $el).val();
	
	console.log('Logging in...');
	
	await request.post({
		url: 'https://osu.ppy.sh/session',
		headers,
		jar,
		json: {
			_token: token,
			username,
			password
		},
	});

	console.log('Logged in!!');
}

module.exports = { auth, headers };