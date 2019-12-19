/** @jsx React.DOM */

'use strict';

var React = require('react'),
    Fluxxor = require('fluxxor'),
    FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var cx = require('classnames');

var CONSTANTS = require('../constants/constants');

module.exports = React.createClass({
    displayName: 'childProductItem.jsx',
    mixins: [FluxMixin, StoreWatchMixin('ProductStore')],
    getStateFromFlux: function() {
        var selectedProducts = this.getFlux().store('ProductStore').getState().selectedProducts;

        selectedProducts = selectedProducts.filter(function(product) {
            return (this.props.product.id === product.id);
        }.bind(this));

        return {
            confirm: (selectedProducts.length > 0)
        };
    },
    render: function() {
        var item, discounts, displayPrice, displayCommission, hasDiscount;

        if (this.state.confirm === false) {
            var itemImage;
            var product = this.props.product;

            if (product.discount) {
                if (product.discount && product.discount.discount_type === 'percent') {
                    hasDiscount = true;

                    discounts = (
                        <div className="child_item_discounts"> 
                            { product.discount.value }%<br/>
                            OFF
                        </div>

                    );
                }
            }

            if (product.image) {
                itemImage = (
                    <span className="child_item_image" style={ { backgroundImage: 'url(' + product.image + ')'}  }>
                        { discounts }
                    </span>
                );
            }

            displayPrice = this.props.product.price;
            displayCommission = this.props.product.expected_commission;

            if (Number.isInteger) {
                if (Number.isInteger(this.props.product.price) === false) {
                    displayPrice = this.props.product.price.toFixed(2);
                }
                if (Number.isInteger(this.props.product.expected_commission) === false) {
                    displayCommission = this.props.product.expected_commission.toFixed(2);
                }
            } else {
                displayPrice = this.props.product.price.toFixed(2);
                displayCommission = this.props.product.expected_commission.toFixed(2);
            }

            item = (
                <div className={ cx({ child_item: true, child_item_bubble: hasDiscount }) }>
                    { itemImage }
                    <h2>{ this.props.product.name }</h2>
                    <div className="child_item_details">
                        <div className="child_item_earn">
                            <small>You earn:</small>
                            £{ displayCommission }
                        </div>
                        <div className="child_item_price">
                            <small>Price:</small>
                            £{ displayPrice }
                        </div>
                    </div>
                    <div className="child_item_buy"><small>Buy from:</small>{ this.props.product.merchant_name }</div>
                    <button className="child_item_add" onClick={ this.selectedChild }>Add</button>
                </div>
            );
        } else {
            item = (
                <div className="child_item_confirm">
                    <strong>Added to basket!</strong>
                    <button onClick={ this.backToSearch }>Back to search</button>
                    <button onClick={ this.goToBasket }>Go to basket</button>
                </div>
            );
        }
    	return (
            <li>
                { item }
            </li>
    	);
    },
    selectedChild: function(e) {
        this.setState({ confirm: true });

        this.getFlux().actions.products.add({
            product: this.props.product
        });
    },
    backToSearch: function(e) {
        this.getFlux().actions.page.update({
            page: 'masterProduct'
        });
    },
    goToBasket: function(e) {
        this.getFlux().actions.page.update({
            page: 'confirmation'
        });
    }

});