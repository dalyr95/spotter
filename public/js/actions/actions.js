'use strict';

var CONSTANTS = require('../constants/constants');

var actions = {
	auth: {
		init: function() {
			this.dispatch(CONSTANTS.AUTH.INIT, {});
		},
		autho: {
			get: function() {
				this.dispatch(CONSTANTS.AUTH.AUTHO.GET, {});
			},
			lock: function() {
				this.dispatch(CONSTANTS.AUTH.AUTHO.LOCK, {});
			},
			show: function() {
				this.dispatch(CONSTANTS.AUTH.AUTHO.SHOW, {});
			},
			logout: function() {
				this.dispatch(CONSTANTS.AUTH.AUTHO.LOGOUT, {});
			}
		},
		spotter: {
			get: function() {
				this.dispatch(CONSTANTS.AUTH.SPOTTER.GET, {});
			}
		}
	},
	email: {
		send: function() {
			this.dispatch(CONSTANTS.EMAIL.SEND, {});
		}
	},
	page: {
		goBack: function() {
			this.dispatch(CONSTANTS.PAGE.GOBACK, {});
		},
		update: function(payload) {
			this.dispatch(CONSTANTS.PAGE.UPDATE, { page: payload.page });
		}
	},
	products: {
		add: function(payload) {
			this.dispatch(CONSTANTS.PRODUCTS.ADD, { product: payload.product });
		},
		search: function(payload) {
			this.dispatch(CONSTANTS.PRODUCTS.SEARCH, {
				brand: payload.brand_id,
				value: payload.search_term
			});
		},
		remove: function(id) {
			this.dispatch(CONSTANTS.PRODUCTS.REMOVE, { id: id });
		},
		reset: function() {
			this.dispatch(CONSTANTS.PRODUCTS.RESET);
		}
	},
	childProducts: {
		get: function(payload) {
			this.dispatch(CONSTANTS.CHILDPRODUCTS.GET, {
				id: payload.id,
				value: payload.value,
				limit: payload.limit
			});
		}
	},
	masterProducts: {
		search: function(payload) {
			this.dispatch(CONSTANTS.MASTERPRODUCTS.SEARCH, {
				value: payload.value
			});
		},
		selected: function(payload) {
			this.dispatch(CONSTANTS.MASTERPRODUCTS.SELECTED, {
				masterProduct: payload.masterProduct
			});
		},
		value: function(payload) {
			this.dispatch(CONSTANTS.MASTERPRODUCTS.VALUE, {
				value: payload.value
			});
		}
	},
	client: {
		add: function(payload) {
			this.dispatch(CONSTANTS.CLIENT.ADD, { client: payload.client });
		},
		delete: function(payload) {
			this.dispatch(CONSTANTS.CLIENT.DELETE, { client: payload.client });
		},
		image: {
			add: function(payload) {
				this.dispatch(CONSTANTS.CLIENT.IMAGE.ADD, payload);
			},
			uploaded: function(payload) {
				this.dispatch(CONSTANTS.CLIENT.IMAGE.UPLOADED, payload);
			}
		},
		set: function(payload) {
			this.dispatch(CONSTANTS.CLIENT.SET, { client: payload.client });
		},
		update: function(payload) {
			this.dispatch(CONSTANTS.CLIENT.UPDATE, { client: payload.client });
		}
	},
	clients: {
		get: function() {
			this.dispatch(CONSTANTS.CLIENTS.GET);
		}
	},
	trainer: {
		image: {
			add: function(payload) {
				this.dispatch(CONSTANTS.TRAINER.IMAGE.ADD, payload);
			},
			uploaded: function(payload) {
				this.dispatch(CONSTANTS.TRAINER.IMAGE.UPLOADED, payload);
			}
		},
		update: function(payload) {
			this.dispatch(CONSTANTS.TRAINER.UPDATE, { trainer: payload.trainer });
		}
	}
};

module.exports = actions;
