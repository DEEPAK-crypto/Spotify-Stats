var navs = document.querySelectorAll('.sidebar__link-container');

navs.forEach((nav) => {
	nav.addEventListener('click', function() {
		navChange(nav);
	});
});

function navChange(element) {
	navs.forEach((nav) => {
		nav.classList.remove('active');
	});
	element.classList.add('active');
}
