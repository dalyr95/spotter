/** @jsx React.DOM */

'use strict';

var React = require('react'),
	Fluxxor = require('fluxxor'),
	FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var cx = require('classnames');

var CONSTANTS = require('../constants/constants');

var ConfirmationProductItem	= require('./confirmationProductItem.jsx');

module.exports = React.createClass({
	displayName: 'confirmation.jsx',
	mixins: [FluxMixin, StoreWatchMixin('ClientStore', 'ProductStore')],
	getInitialState: function() {
		return {};
	},
	getStateFromFlux: function() {
		var flux = this.getFlux();
		return {
			selectedUser: flux.store('ClientStore').getState().client,
			selectedProducts: flux.store('ProductStore').getState().selectedProducts
		};
	},
	componentDidMount: function() {
		window.scrollTo(0,0);
	},
    render: function() {

		var totalPrice, totalSaving, commisionPrice, proceedButton, saving, total;

		var selectedProducts = [];
		if (this.state.selectedProducts.length > 0) {
			totalPrice		= 0;
			commisionPrice	= 0;
            totalSaving     = 0;

			this.state.selectedProducts.forEach(function(product) {
				totalPrice		+= product.original_price;
				commisionPrice	+= product.expected_commission;
                totalSaving     += (product.original_price - product.price);

				selectedProducts.push(
					(<ConfirmationProductItem key={product.id} product={ product }></ConfirmationProductItem>)
				);
			});

			proceedButton = (<button type="submit" onClick={this.proceed}>Proceed</button>);

            if (totalSaving > 0) {
                var clientCost = totalPrice - totalSaving;
                saving = (
                        <div>
                            <div>SPOTTER DISCOUNTS:</div><div>-&pound;{ totalSaving.toFixed(2) }</div>
                        </div>
                );  
                total = (
                        <div>
                            <div><strong>TOTAL FOR CLIENT:</strong></div><div><strong>&pound;{ clientCost.toFixed(2) }</strong></div>
                        </div>
                );  
            }

            commisionPrice  = (Math.round(commisionPrice * 100) / 100).toFixed(2);
            totalPrice      = totalPrice.toFixed(2);
		}

        return (
            <div className="page page_confirmation light_blue">
                <div className="confirmation_header">
                	Here's what you'd like to recommend to {this.state.selectedUser.fname}:
                </div>
                <ul className="item_list confirmation_product_results">
                	{selectedProducts}
                </ul>
                <div className="confirmation_prices">
                    <div>
                        <div>PRODUCT COST:</div><div>&pound;{totalPrice}</div>
                    </div>
                    { saving }
                    { total }
                    <div className="confirmation_earn">
                        <div><strong>YOU CAN EARN:</strong></div><div><strong>&pound;{commisionPrice}</strong></div>
                    </div>
                </div>
                <div className="confirmation_send center">
                    <p>Send recommendation via:</p>
                    <button className="button_email" onClick={this.send}>Email</button>
                    <p/>
                    <button className="button_whatsapp" onClick={this.send}>WhatsApp</button>
                </div>
            </div>
        );
    },
    send: function(e) {
        this.getFlux().actions.email.send();

        if (e.currentTarget.innerText === 'WhatsApp') {
            var trainer = this.getFlux().store('AuthStore').getState().trainer;
            var message = 'Hi ' + this.state.selectedUser.fname + ',\nYour trainer ' +trainer.name + ' has recommended you these products.\n\nThanks,\nSPOTTER\n\n';
            message += 'https://www.spotter.online\n\n';

            this.state.selectedProducts.forEach(function(value) {
                var price           = value.price
                var original_price  = value.original_price;

                if (Number.isInteger) {
                    if (Number.isInteger(value.price) === false) { price = value.price.toFixed(2); }
                    if (Number.isInteger(value.original_price) === false) { original_price = value.original_price.toFixed(2); }
                } else {
                    price = price.toFixed(2);
                    original_price = original_price.toFixed(2);
                }

                var discount = (value.price !== value.original_price) ? ', was £' + original_price : '';

                message += value.name + ' (£' + price + discount + ')\n';
                message += value.link + '\n\n';
            });

            window.open(
                'whatsapp://send?text=' + encodeURIComponent(message),
                'Spotter'
            );
        }

        this.getFlux().actions.page.update({
            page: 'success'
        });
    },
});