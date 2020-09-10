var navs = document.querySelectorAll('.sidebar__link-container');
var sections = document.querySelectorAll('.content');
var artists = document.querySelectorAll('.top-nav__link.a');
var artistDiv = document.querySelectorAll('.artist__container.a');
var tracks = document.querySelectorAll('.top-nav__link.t');
var trackDiv = document.querySelectorAll('.track__container.t');
var moreBtn = document.querySelectorAll('.see_more');

moreBtn.forEach((btn) => {
	btn.addEventListener('click', function() {
		btnChange(btn);
	});
});

function btnChange(element) {
	navs.forEach((nav) => {
		nav.classList.remove('active');
	});
	sections.forEach((section) => {
		section.style.display = 'none';
	});
	if (element.id == 'top-artistsS') document.querySelector('#top-artists').classList.add('active');
	else document.querySelector('#top-tracks').classList.add('active');
	document.querySelector(`#${element.id}ec`).style.display = 'block';
}

navs.forEach((nav) => {
	nav.addEventListener('click', function() {
		navChange(nav);
	});
});

function navChange(element) {
	navs.forEach((nav) => {
		nav.classList.remove('active');
	});
	sections.forEach((section) => {
		section.style.display = 'none';
	});
	document.querySelector(`#${element.id}Sec`).style.display = 'block';
	element.classList.add('active');
}

artists.forEach((artist) => {
	artist.addEventListener('click', function() {
		artistChange(artist);
	});
});

function artistChange(element) {
	artists.forEach((artist) => {
		artist.classList.remove('active');
	});
	artistDiv.forEach((div) => {
		div.style.display = 'none';
	});
	document.querySelector(`#${element.id}DivA`).style.display = 'grid';
	element.classList.add('active');
}

tracks.forEach((track) => {
	track.addEventListener('click', function() {
		trackChange(track);
	});
});

function trackChange(element) {
	tracks.forEach((track) => {
		track.classList.remove('active');
	});
	trackDiv.forEach((div) => {
		div.style.display = 'none';
	});
	document.querySelector(`#${element.id}DivT`).style.display = 'block';
	element.classList.add('active');
}
