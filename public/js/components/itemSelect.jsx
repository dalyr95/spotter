/** @jsx React.DOM */

'use strict';

var React = require('react'),
	Fluxxor = require('fluxxor'),
	FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var cx = require('classnames');

var SearchBar = require('./searchBar.jsx');

var originalState = {
	product: { name: '' }
};

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
	mixins: [FluxMixin, StoreWatchMixin('ProductStore')],
    displayName: 'itemSelect.jsx',
	getInitialState: function() {
		return {
			product: { name: '' }
		};
	},
	getStateFromFlux: function() {
		return {
			selectedProducts: this.getFlux().store('ProductStore').getState().selectedProducts
		};
	},
    componentDidMount: function() {
        this.getFlux().store('ProductStore').on('change:updateProduct', this.updateProductList);
    },
    componentWillUnmount: function() {
        this.getFlux().store('ProductStore').off('change:updateProduct', this.updateProductList);
    },
    render: function() {
		var productMatches;
		if (this.state.productMatches && this.state.product.name.length > 0) {
			productMatches = (<SearchBar reactKeys="id" keys="name" matches={ this.state.productMatches } onSelectedAction={this.searchProductsSelected} />)
		}

        return (
            <div>
                <form>
                	<label>
                		Product
                		<input id="product_search" type="text" placeholder="e.g. Pure Protein GF-1..." value={this.state.product.name}  autoComplete="off" autoCorrect="off" autoCapitalize="off" onChange={this.searchProducts} />
                		{ productMatches }
                	</label>
                	<button type="submit" onClick={ this.addItem } disabled={!(this.state.product && this.state.product.id)}>Add Item</button>
                </form>
            </div>
        );
    },
    searchProducts: function(e) {
    	var productMatches = [];
    	var value = e.currentTarget.value.toString().toLowerCase();

    	if (value.length > 0) {
            this.getProducts(value);
	    }  

    	this.setState({
    		product: { name: e.currentTarget.value }
    	});
    },
    getProducts: debounce(function(value) {
        this.getFlux().actions.products.search({
            search_term: value
        });
    }, 250),
    updateProductList: function() {
        var matches = (this.state.product.name.length > 0) ? this.getFlux().store('ProductStore').getState().products : [];

        this.setState({
            productMatches: matches
        });
    },
    searchProductsSelected: function(value) {
    	this.setState({
    		productMatches: null,
    		product: value.value
    	});

    	setTimeout(function() {
	    	document.activeElement.blur();
    	}, 0);
    },
    addItem: function(e) {
    	e.preventDefault();

    	var productID = this.state.product.id;

    	var dupeProducts = this.state.selectedProducts.filter(function(product) {
    		return (productID === product.id);
    	});

    	if (dupeProducts.length > 0) {
    		alert('You already have added ' + this.state.product.name);
    	} else {
	    	this.getFlux().actions.products.add({
	    		product: this.state.product
	    	});
	    }

	    var newState = JSON.parse(JSON.stringify(originalState));

    	this.setState(newState);
    }

});