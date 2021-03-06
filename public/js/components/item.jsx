/** @jsx React.DOM */

'use strict';

var React = require('react'),
	Fluxxor = require('fluxxor'),
	FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var cx = require('classnames');

module.exports = React.createClass({
	mixins: [FluxMixin],
	getInitialState: function() {
		return {};
	},
	getStateFromFlux: function() {
		return {};
	},
    render: function() {
        var item = this.props.item;
        return (
            <div className="item" onClick={ this.props.action }>
                <div className="item_img" style={{backgroundImage: 'url(' + item.image + '), url(images/icon.png)'}}></div>
                {item.name}
                <div className="item_price">&pound;{item.price.toFixed(2)}</div>
            </div>
        );
    }

});