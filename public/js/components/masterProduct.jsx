/** @jsx React.DOM */

'use strict';

var React = require('react'),
	Fluxxor = require('fluxxor'),
	FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var CONSTANTS = require('../constants/constants');

var MasterProductItem	= require('./masterProductItem.jsx');

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        }, wait);
        if (immediate && !timeout) func.apply(context, args);
    };
};

module.exports = React.createClass({
	displayName: 'masterProduct.jsx',
	mixins: [FluxMixin, StoreWatchMixin('ClientStore', 'ProductStore')],
	getStateFromFlux: function() {
		var flux = this.getFlux();
		var productStore = flux.store('ProductStore').getState();

		return {
			loading: productStore.loading,
			selectedUser: flux.store('ClientStore').getState().client,
			masterProducts: productStore.masterProducts,
			selectedProducts: productStore.selectedProducts,
			value: productStore.value
		};
	},
	componentDidMount: function() {
		window.scrollTo(0,0);
	},
    render: function() {
		var masterProducts, loading, tip;

		if (this.state.masterProducts.length > 0 && this.state.loading === false) {
			var masterProductsArray = [];

    		this.state.masterProducts.forEach(function(mp) {
    			masterProductsArray.push(
    				(<MasterProductItem key={ mp.id } masterProduct={ mp } value={ this.state.value } />)
    			);
    		}.bind(this));

			masterProducts = (
				<ul className="item_list product_results">
					{ masterProductsArray }
				</ul>
			);
    	}

    	if (this.state.loading === true) {
    		loading = (
    			<div className="spotter_loader"></div>
    		);
    	}

    	if (!masterProducts && this.state.loading === false) {
    		tip = (
    			<div className="spotter_tip">
    				<em>How does this work?</em>
    				<p>Step 1 - Search for products to recommend to your client</p>
    				<p>Step 2 - choose a product that works for your client and send it to them</p>
					Step 3 - if they buy that product from the Spotter email link, you earn commission!
    			</div>
    		);
    	}

    	return (
    		<div className="page page_master_product light_blue">
    			<div className="product_search">
    				<p>Recommend to { this.state.selectedUser.fname }</p>
    				<input type="text" placeholder="E.g. GF-1, Creatine, Vitamin C…" autoCapitalize="none" autoCorrect="off" onChange={ this.productInput } value={ this.state.value } />
    			</div>
    			{ loading }
    			{ masterProducts }
    			{ tip }
    		</div>
    	);
    },
    productInput: function(e) {
    	this.getProducts(e.currentTarget.value);

    	this.getFlux().actions.masterProducts.value({
    		value: e.currentTarget.value
    	});
    },
    viewBasket: function(e) {
        this.getFlux().actions.page.update({
            page: 'confirmation'
        });
    },
    getProducts: debounce(function(value) {
    	this.getFlux().actions.masterProducts.search({
    		value: value
    	});
    }, 500)

});