/** @jsx React.DOM */

'use strict';

var React = require('react'),
	Fluxxor = require('fluxxor'),
	FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var cx = require('classnames');

var CONSTANTS = require('../constants/constants');

var Item = require('./item.jsx');
var ItemSelect = require('./itemSelect.jsx');

module.exports = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin('UserStore', 'ProductStore')],
	getInitialState: function() {
		return {};
	},
	getStateFromFlux: function() {
		var flux = this.getFlux();
		return {
			selectedUser: flux.store('UserStore').getState().client,
			selectedProducts: flux.store('ProductStore').getState().selectedProducts
		};
	},
	componentDidMount: function() {
		window.scrollTo(0,0);
	},
    render: function() {
		var avatarClasses = {
			user_avatar: true
		};
		var avatarInlineCSS = {};

		if (this.state.selectedUser && this.state.selectedUser.avatar) {
			avatarClasses.user_selected 	= true;
			avatarInlineCSS.backgroundImage = 'url(images/avatars/' + this.state.selectedUser.avatar + '.jpg)';
		}

		var totalPrice, commisionPrice, proceedButton;

		var selectedProducts = [];
		if (this.state.selectedProducts.length > 0) {
			totalPrice 		= 0;
			commisionPrice 	= 0;

			this.state.selectedProducts.forEach(function(product) {
				totalPrice 		+= product.price;
				commisionPrice 	+= product.price * 0.1;
				selectedProducts.push(
					(<Item key={product.id} item={product} />)
				);
			});

			commisionPrice 	= 	(<span>{(Math.round(commisionPrice * 100) / 100).toFixed(2)}</span>);
			totalPrice 		= 	(
									<div className="product_price right">
										<p>Total Price: &pound;{totalPrice.toFixed(2)} (&pound;{commisionPrice})</p>
									</div>
								);

			proceedButton = (<button type="submit" onClick={this.proceed}>Proceed</button>);
		}

        return (
            <div className="page page_product">
                <div className={cx(avatarClasses)} style={avatarInlineCSS}></div>
                <p className="center">Select your recommended products for {this.state.selectedUser.name}</p>
                <div className="item_list">
                	{selectedProducts}
                </div>
                {totalPrice}
                <ItemSelect />
                { proceedButton }
            </div>
        );
    },
    proceed: function(e) {
    	e.preventDefault();
    	this.getFlux().actions.page.update({
    		page: 'confirmation'
    	});
    }

});