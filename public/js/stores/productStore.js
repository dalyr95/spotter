'use strict';

var Fluxxor = require('fluxxor');
var CONSTANTS = require('../constants/constants');

var SpotterAPI = require('../lib/spotter');

var ProductStore = Fluxxor.createStore({
    initialize: function(params) {
		this.state = {
			products: [],
			selectedProducts: []
		};

        this.bindActions(
            CONSTANTS.PRODUCTS.ADD,		this.addProduct,
            CONSTANTS.PRODUCTS.REMOVE,	this.removeProduct,
            CONSTANTS.PRODUCTS.RESET,	this.resetStore,
            CONSTANTS.PRODUCTS.SEARCH,	this.productSearch
        );
    },
    getState: function(){
        return this.state;
    },
    addProduct: function(payload) {
        this.state.selectedProducts.push(payload.product);
        this.emit('change');
    },
    removeProduct: function(payload) {
        this.state.selectedProducts = this.state.selectedProducts.filter(function(product) {
            return (payload.id !== product.id);
        });

        this.emit('change');
    },
    resetStore: function() {
        this.state.selectedProducts = [];
        this.emit('change');
    },
    productSearch: function(payload) {
		var query = '?name=' + payload.value;

		this.emit('change');

		SpotterAPI.getProducts(query, function(data) {
			this.state.products = data.data;
			this.emit('change:updateProduct');
			this.emit('change');
		}.bind(this));
    }
});

module.exports = ProductStore;
