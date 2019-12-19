'use strict';

var Fluxxor = require('fluxxor');
var CONSTANTS = require('../constants/constants');

var SpotterAPI = require('../lib/spotter');

var ProductStore = Fluxxor.createStore({
    initialize: function(params) {
		this.state = {
			products: [],
			selectedProducts: [],
            masterProducts: [],
            childProducts: [],
            selectedMasterProduct: null,
            loading: false,
            value: ''
		};

        this.bindActions(
            CONSTANTS.PRODUCTS.ADD,             this.addProduct,
            CONSTANTS.PRODUCTS.REMOVE,          this.removeProduct,
            CONSTANTS.PRODUCTS.RESET,           this.resetStore,
            CONSTANTS.PRODUCTS.SEARCH,          this.productSearch,
            CONSTANTS.MASTERPRODUCTS.SELECTED,  this.masterProductSelected,
            CONSTANTS.MASTERPRODUCTS.SEARCH,    this.masterProductSearch,
            CONSTANTS.MASTERPRODUCTS.VALUE,     this.masterProductValue,
            CONSTANTS.CHILDPRODUCTS.GET,        this.childProductsGet
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

        this.state.loading = true;

		this.emit('change');

		SpotterAPI.getProducts(query, function(data) {
			this.state.products = data.data;
            this.state.loading = false;

			this.emit('change:updateProduct');
			this.emit('change');
		}.bind(this));
    },
    masterProductSearch: function(payload) {
        var query = '?name=' + payload.value;

        this.state.loading = true;

        this.emit('change');

        SpotterAPI.getMasterProducts(query, function(data) {
            this.state.masterProducts = data.data;
            this.state.loading = false;

            this.emit('change:updateMasterProduct');
            this.emit('change');
        }.bind(this));
    },
    masterProductValue: function(payload) {
        this.state.loading = true;
        this.state.value = payload.value;

        this.emit('change:updateMasterProductValue');
        this.emit('change');
    },
    masterProductSelected: function(payload) {
        this.state.selectedMasterProduct = payload.masterProduct;
    },
    childProductsGet: function(payload) {
        var query = '?master_product=' + this.state.selectedMasterProduct.id;

        if (payload.limit) { query += '&limit=' + payload.limit; }

        this.state.loading = true;

        this.emit('change');

        SpotterAPI.getChildProducts(query, function(data) {
            this.state.childProducts = data.data;
            this.state.loading = false;

            this.emit('change:loadedChildProduct');
            this.emit('change');
        }.bind(this));
    }
});

module.exports = ProductStore;
