'use strict';

var baseURL = 'https://data.spotter.online/api/';
var G = 'GET';
var P = 'POST';

var productQueue = [];

var spotterAPI = {
	addClient: function(data, cb) {
		this.XHR('client/new', P, cb, JSON.stringify(data));
	},
	deleteClient: function(data, cb) {
		this.XHR('client/delete/' + data.id, P, cb);
	},
	updateClient: function(data, cb) {
		this.XHR('client/update/' + data.id, P, cb, JSON.stringify(data));
	},
	imageClient: function(id, file, cb) {
		this.xhrImage('client/update-image/' + id, file, cb);
	},
	imageTrainer: function(file, cb) {
		this.xhrImage('update-image', file, cb);
	},
	getClients: function(cb) {
		this.XHR('client/list?limit=500', G, cb);
	},
	getProducts: function(query, cb) {
		productQueue.forEach(function(xhr) {
			xhr.abort();
		});
		productQueue = [];

		productQueue.push(this.xhrQuery('products' + query, G, cb));
	},
	getMasterProducts: function(query, cb) {
		productQueue.forEach(function(xhr) {
			xhr.abort();
		});
		productQueue = [];

		productQueue.push(this.xhrQuery('search/products' + query, G, cb));
	},
	getChildProducts: function(query, cb) {
		productQueue.forEach(function(xhr) {
			xhr.abort();
		});
		productQueue = [];

		productQueue.push(this.xhrQuery('search/deals' + query, G, cb));
	},
	getTrainer: function(cb) {
		this.XHR('profile', G, cb);
	},
	updateTrainer: function(data, cb) {
		this.XHR('profile/update', P, cb, JSON.stringify(data));
	},
	sendClientEmail: function(data, cb) {
		this.XHR('recommend/new', P, cb, JSON.stringify(data));
	},
	XHR: function(frag, method, cb, data) {
	    var xhr = new XMLHttpRequest();
	    xhr.addEventListener('load', function(data) {
			cb(JSON.parse(data.currentTarget.responseText));
	    });
	    xhr.open(method, 'https://data.spotter.online/api/' + frag, true);
	    xhr.setRequestHeader('Accept', 'application/json');
	    xhr.setRequestHeader('Authorization', 'Bearer ' + window.flux.stores.AuthStore.state.token);
	    if (method === 'POST') {
			xhr.setRequestHeader('Content-type', 'application/json');
			xhr.send(data);
	    } else {
		    xhr.send();
		}

	    return xhr;
	},
	xhrQuery: function(frag, method, cb, data) {
	    var xhr = new XMLHttpRequest();
	    xhr.addEventListener('load', function(data) {
			cb(JSON.parse(data.currentTarget.responseText));
	    });
	    var query = (frag.indexOf('?') === -1) ? '?' : '&';
	    xhr.open(method, 'https://data.spotter.online/api/' + frag + query + 'token=' + window.flux.stores.AuthStore.state.token, true);
	    xhr.send();

	    return xhr;
	},
	xhrImage: function(frag, file, cb) {
		var formData = new FormData();
		formData.append('file', file);

		var xhr = new XMLHttpRequest();

		xhr.addEventListener('load', function(data){
			cb(JSON.parse(data.currentTarget.responseText));
		}, false);

		xhr.open('POST', 'https://data.spotter.online/api/' + frag);
		xhr.setRequestHeader('Accept', 'application/json');
		xhr.setRequestHeader('Authorization', 'Bearer ' + window.flux.stores.AuthStore.state.token);

		xhr.send(formData);
	},
	generateQueryString: function(obj) {
		var str = [];
		for(var p in obj)
		if (obj.hasOwnProperty(p)) {
			str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
		}
		return str.join('&');
	}
};

module.exports = spotterAPI;