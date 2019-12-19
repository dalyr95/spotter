/** @jsx React.DOM */

'use strict';

var React = require('react'),
	Fluxxor = require('fluxxor'),
	FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var CONSTANTS = require('../constants/constants');

var Avatar		= require('./avatar.jsx');
var ItemGrid 	= require('./itemGrid.jsx');

module.exports = React.createClass({
	displayName: 'email.jsx',
	mixins: [FluxMixin, StoreWatchMixin('ClientStore', 'ProductStore')],
	getInitialState: function() {
		return {};
	},
	getStateFromFlux: function() {
		var flux = this.getFlux();
		return {
			trainer:			flux.store('AuthStore').getState().trainer,
			selectedUser:		flux.store('ClientStore').getState().client,
			selectedProducts:	flux.store('ProductStore').getState().selectedProducts
		};
	},
	componentDidMount: function() {
		window.scrollTo(0,0);
	},
    render: function() {
        return (
            <div className="page page_email">
                <Avatar person={this.state.trainer} />
                <div>
                	<p>Hi {this.state.selectedUser.fname}</p>
					<p>Your trainer Rob has chosen these products specifically for you through Spotter. These are Rob's recommendations for the best sports supplements to help you achieve your goals.</p>
					<p>We know you're busy doing the hard work in the gym, so here at Spotter we've done the hard work of finding the very best sites for you to buy from. Just click the buttons below to purchase, and Rob will be notified that you followed his advice.</p>
                </div>
                <div>
                	<ItemGrid />
                </div>
                <div>
					<p>Spotter finds the best deals from the top supplements brands in the UK, so your personal trainer can recommend products to you knowing you’ll get a great price when you buy.</p>
				</div>
            </div>
        );
    }
});