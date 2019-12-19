/** @jsx React.DOM */

'use strict';

var React = require('react'),
    Fluxxor = require('fluxxor'),
    FluxMixin = Fluxxor.FluxMixin(React);

var cx = require('classnames');

module.exports = React.createClass({
    mixins: [FluxMixin],
    render: function() {
        var result = this.props.result;

        var discount;

        if (result.discount && result.discount.discount_type) {
            if (result.discount.discount_type === 'percent') {
                discount = (<strong className="searchbar_result_discount">EXCLUSIVE {result.discount.value}% OFF</strong>);
            } else if (result.discount.discount_type === 'flat') {
                discount = (<strong className="searchbar_result_discount">SAVE £{result.discount.value}</strong>);
            }
        }

        return (
            <li className={cx({'searchbar_result': true, 'searchbar_result_has_discount': discount})} onClick={this.onSelected}>
                <div className="searchbar_result_image" style={ { backgroundImage: 'url(' + result.image + ')' } }></div>
                {result.name}{discount}
            </li>
        );
    },

    onSelected: function(e) {
        this.props.onSelectedAction({
            value: this.props.result
        });
    }

});