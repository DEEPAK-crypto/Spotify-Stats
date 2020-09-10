var navs = document.querySelectorAll('.sidebar__link-container');
var sections = document.querySelectorAll('.content');

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
