/** @jsx React.DOM */

'use strict';

var React = require('react'),
	Fluxxor = require('fluxxor'),
	FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var cx = require('classnames');

var CONSTANTS = require('../constants/constants');

var ChildProductItem	= require('./childProductItem.jsx');

module.exports = React.createClass({
	displayName: 'product.jsx',
	mixins: [FluxMixin, StoreWatchMixin('ClientStore', 'ProductStore')],
	getInitialState: function() {
		return {
			loadMore: false,
			readMore: false,
			image: null
		};
	},
	getStateFromFlux: function() {
		var flux = this.getFlux();
		var productStore = flux.store('ProductStore').getState();

		return {
			selectedUser: flux.store('ClientStore').getState().client,
			loading: productStore.loading,
			masterProduct: productStore.selectedMasterProduct,
			childProducts: productStore.childProducts,
			selectedProducts: productStore.selectedProducts
		};
	},
	componentDidMount: function() {
		window.scrollTo(0,0);
	},
	componentDidUpdate: function() {
		if (!this.state.image && this.state.childProducts[0] && this.state.childProducts[0].image) {
			var img = document.createElement('img');
			img.onload = function() {
				this.setState({
					image: this.state.childProducts[0].image
				});
			}.bind(this);

			img.src = this.state.childProducts[0].image;
		}
	},
    render: function() {
		var childProducts, loading, goToBasket, goBack, loadMore, description;
		var productDetailsClasses = {
			master_product_details: true
		};

		if (this.state.loading === false || this.state.loadMore === true) {
			if (this.state.childProducts && this.state.childProducts.length > 0) {
				var childProductsArray = [];

				this.state.childProducts.forEach(function(product) {
					childProductsArray.push(
    					(<ChildProductItem key={ product.id } product={ product } />)
	    			);
				}.bind(this));

				childProducts = (
					<ul className="item_list child_product_results">
						{ childProductsArray }
					</ul>
				);

				if (this.state.loadMore === false && this.state.masterProduct.deals > 10) {
					loadMore = (
						<div className="page_child_go">
							<button onClick={ this.loadMore }>Load more</button>
						</div>
					);
				}
	    	} else {
	    		loading = (
	    			<div className="item_not_found">
	    				No results found
	    			</div>
	    		);
	    	}

	    	if (this.state.selectedProducts.length > 0) {
	    		goToBasket = (
	    			<div className="page_child_go">
	    				<button className="green_btn" onClick={ this.goToBasket }>Go to basket</button>
	    			</div>
	    		)
	    	}

	    	goBack = (
    			<div className="page_child_go">
    				<button className="trans_btn" onClick={ this.goBack }>Back to search</button>
    			</div>
    		);
	    }

    	if (this.state.loading === true) {
    		loading = (
				<div className="spotter_loader"></div>
    		);
    	}

    	var masterProduct = this.state.masterProduct;

    	var productImage;

    	if (this.state.image) {
    		productImage = { backgroundImage: 'url(' + this.state.image + ')' }
    		productDetailsClasses.img_loaded = true;
    	}

    	if (masterProduct.description) {
    		var readMore;
    		var text = masterProduct.description;

    		if (masterProduct.description.length > 100 && this.state.readMore === false) {
    			text = masterProduct.description.slice(0, 100) + '...';

    			readMore = (<a href="#" onClick={ this.readMore }>Read more</a>);
    		}
    		description = (
    			<p>
    				{ text }
    				{ readMore }
    			</p>
    		);
    	}

    	return (
    		<div className="page page_child_product light_blue">
    			<div className={cx(productDetailsClasses)}>
    				<div className="page_child_product_image" style={ productImage }></div>
    				<h2>{ masterProduct.name }</h2>
    				{ description }
    			</div>
    			{ childProducts }
    			{ loading }
    			<div className="go_back_container">
    				{ loadMore }
	    			{ goToBasket }
	    			{ goBack }
	    		</div>
    		</div>
    	);
    },
    goToBasket: function() {
        this.getFlux().actions.page.update({
            page: 'confirmation'
        });
    },
    goBack: function() {
        this.getFlux().actions.page.update({
            page: 'masterProduct'
        });
    },
    loadMore: function(e) {
    	e.preventDefault();

        this.getFlux().actions.childProducts.get({
            id: this.state.masterProduct.id,
            limit: this.state.masterProduct.deals
        });

    	this.setState({
    		loadMore: true
    	});
    },
    readMore: function(e) {
    	e.preventDefault();

    	this.setState({
    		readMore: true
    	});
    }

});