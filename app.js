/** @jsx React.DOM */
process.env.NODE_ENV = 'dev';

if ('serviceWorker' in navigator) {
	if (window.location.search.search('refresh=true') > -1) {
		navigator.serviceWorker.getRegistrations().then(function(registrations) {
			for(let registration of registrations) {
				registration.unregister();
			}
		});
	}

	navigator.serviceWorker.register('./serviceWorker.js', {scope: './'}).then(function(reg) {
		console.log('◕‿◕', reg);
	}, function(err) {
		console.log('ಠ_ಠ', err);
	});
}

var App = require('./public/js/main.js');
App.init();