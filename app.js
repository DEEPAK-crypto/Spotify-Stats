const express = require('express'),
	axios = require('axios'),
	bodyParser = require('body-parser');
var request = require('request');
var app = express();
var querystring = require('querystring');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

var client_id = 'b3cd9c2e0f2d4591b584820ab5f5e11e';
var client_secret = 'be918ee525ee453a8e4821689ee1c27f';
var redirect_uri = 'http://localhost:3000/logedIn';

app.get('/', function(req, res) {
	res.redirect('/login');
});

var authInfo = {};
var currentUser = {};

app.get('/login', function(req, res) {
	var scopes =
		'user-read-private user-read-email user-read-recently-played user-top-read user-follow-read user-follow-modify playlist-read-private playlist-read-collaborative playlist-modify-public';
	res.redirect(
		'https://accounts.spotify.com/authorize' +
			'?response_type=code' +
			'&client_id=' +
			client_id +
			(scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
			'&redirect_uri=' +
			encodeURIComponent(redirect_uri)
	);
});

app.get('/logedIn', function(req, res) {
	var authOptions = {
		method: 'post',
		url: 'https://accounts.spotify.com/api/token',
		form: {
			code: req.query.code,
			redirect_uri: 'http://localhost:3000/logedIn',
			grant_type: 'authorization_code'
		},
		headers: {
			Authorization: 'Basic ' + new Buffer(client_id + ':' + client_secret).toString('base64')
		},
		json: true
	};
	request.post(authOptions, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			(authInfo.access_token = body.access_token), (authInforefresh_token = body.refresh_token);

			// use the access token to access the Spotify Web API
			// var options = {
			// 	url: 'https://api.spotify.com/v1/me',
			// 	headers: { Authorization: 'Bearer ' + authInfo.access_token },
			// 	json: true
			// };
			const headers = {
				headers: { Authorization: 'Bearer ' + authInfo.access_token },
				json: true
			};

			// const user = axios.get('https://api.spotify.com/v1/me', { headers });

			// console.log(user);
			const user = axios({
				url: 'https://api.spotify.com/v1/me',
				headers: { Authorization: 'Bearer ' + authInfo.access_token },
				json: true
			});
			const track = axios({
				url: 'https://api.spotify.com/v1/me/top/tracks?&limit=10',
				headers: { Authorization: 'Bearer ' + authInfo.access_token },
				json: true
			});
			const artist = axios({
				url: 'https://api.spotify.com/v1/me/top/artists?&limit=10',
				headers: { Authorization: 'Bearer ' + authInfo.access_token },
				json: true
			});

			async function data() {
				await axios
					.all([ user, track, artist ])
					.then(function(response) {
						currentUser.user = response[0].data;
						currentUser.track = response[1].data;
						currentUser.artist = response[2].data;
						res.redirect('/profile');
					})
					.catch(function(error) {
						return error;
					});
			}
			data();

			// 	async function user() {
			// 		currentUser.user = await axios
			// 			.get('https://api.spotify.com/v1/me', headers)
			// 			.then(function(response) {
			// 				return response.data;
			// 			})
			// 			.catch(function(error) {
			// 				return error;
			// 			});
			// 	}
			// 	async function track() {
			// 		currentUser.tracks = await axios
			// 			.get('https://api.spotify.com/v1/me/top/tracks?&limit=10', headers)
			// 			.then(function(response) {
			// 				res.redirect('/profile');
			// 				return response.data;
			// 			})
			// 			.catch(function(error) {
			// 				return error;
			// 			});
			// 	}

			// 	async function artist() {
			// 		currentUser.artist = await axios
			// 			.get('https://api.spotify.com/v1/me/top/artists?&limit=50', headers)
			// 			.then(function(response) {
			// 				res.redirect('/profile');
			// 				return response.data;
			// 			})
			// 			.catch(function(error) {
			// 				return error;
			// 			});
			// 	}

			// 	user();
			// 	track();
			// 	artist();
		}
	});
});

app.get('/profile', function(req, res) {
	console.log(currentUser);
	res.render('profile', { user: currentUser.user, artist: currentUser.artist, track: currentUser.track });
});
app.listen(3000);
