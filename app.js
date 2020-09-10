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
var redirect_uri = 'https://spotify-statss.herokuapp.com/logedIn';

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
			redirect_uri: 'https://spotify-statss.herokuapp.com/logedIn',
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
			const following = axios({
				url: 'https://api.spotify.com/v1/me/following?type=artist&limit=50',
				headers: { Authorization: 'Bearer ' + authInfo.access_token },
				json: true
			});
			const recentlyPlayed = axios({
				url: 'https://api.spotify.com/v1/me/player/recently-played?limit=50',
				headers: { Authorization: 'Bearer ' + authInfo.access_token },
				json: true
			});
			const playlist = axios({
				url: 'https://api.spotify.com/v1/me/playlists',
				headers: { Authorization: 'Bearer ' + authInfo.access_token },
				json: true
			});

			const trackLong = axios({
				url: 'https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=long_term',
				headers: { Authorization: 'Bearer ' + authInfo.access_token },
				json: true
			});
			const trackmedium = axios({
				url: 'https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=medium_term',
				headers: { Authorization: 'Bearer ' + authInfo.access_token },
				json: true
			});
			const trackShort = axios({
				url: 'https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=short_term',
				headers: { Authorization: 'Bearer ' + authInfo.access_token },
				json: true
			});
			const artistLong = axios({
				url: 'https://api.spotify.com/v1/me/top/artists?limit=50&time_range=long_term',
				headers: { Authorization: 'Bearer ' + authInfo.access_token },
				json: true
			});
			const artistMedium = axios({
				url: 'https://api.spotify.com/v1/me/top/artists?limit=50&time_range=medium_term',
				headers: { Authorization: 'Bearer ' + authInfo.access_token },
				json: true
			});
			const artistShort = axios({
				url: 'https://api.spotify.com/v1/me/top/artists?limit=50&time_range=short_term',
				headers: { Authorization: 'Bearer ' + authInfo.access_token },
				json: true
			});

			async function data() {
				await axios
					.all([
						user,
						following,
						recentlyPlayed,
						playlist,
						trackLong,
						trackmedium,
						trackShort,
						artistLong,
						artistMedium,
						artistShort
					])
					.then(function(response) {
						currentUser.user = response[0].data;
						currentUser.following = response[1].data;
						currentUser.recentlyPlayed = response[2].data;
						currentUser.playlist = response[3].data;
						currentUser.trackLong = response[4].data;
						currentUser.trackMedium = response[5].data;
						currentUser.trackShort = response[6].data;
						currentUser.artistLong = response[7].data;
						currentUser.artistMedium = response[8].data;
						currentUser.artistShort = response[9].data;
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
	if (currentUser.user == null) {
		res.redirect('/');
	} else {
		res.render('profile', {
			user: currentUser.user,
			artistLong: currentUser.artistLong,
			artistMedium: currentUser.artistMedium,
			artistShort: currentUser.artistShort,
			trackLong: currentUser.trackLong,
			trackMedium: currentUser.trackMedium,
			trackShort: currentUser.trackShort,
			recents: currentUser.recentlyPlayed,
			playlists: currentUser.playlist,
			following: currentUser.following
		});
	}
});
const PORT = process.env.PORT || 3000;
app.listen(PORT);
