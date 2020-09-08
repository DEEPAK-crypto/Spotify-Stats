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
	res.render('index');
});

var authInfo = {};
var currentUser = {};

app.get('/login', function(req, res) {
	var scopes = 'user-read-private user-read-email';
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
			var options = {
				url: 'https://api.spotify.com/v1/me',
				headers: { Authorization: 'Bearer ' + authInfo.access_token },
				json: true
			};
			request.get(options, function(error, response, body) {
				currentUser.user = body;
			});
			options.url = 'https://api.spotify.com/v1/me/playlists';

			request.get(options, function(error, response, body) {
				currentUser.playlist = body;
				res.redirect('/profile');
			});
		}
	});
});

app.get('/profile', function(req, res) {
	res.render('profile', { user: currentUser.user, playlist: currentUser.playlist });
});
app.listen(3000);
