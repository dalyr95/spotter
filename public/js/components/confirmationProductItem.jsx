/** @jsx React.DOM */

'use strict';

var React = require('react'),
    Fluxxor = require('fluxxor'),
    FluxMixin = Fluxxor.FluxMixin(React);

var cx = require('classnames');

var CONSTANTS = require('../constants/constants');

module.exports = React.createClass({
    displayName: 'confirmationProductItem.jsx',
    mixins: [FluxMixin],
    getInitialState: function() {
        return {
            confirm: false
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
                    <span className={ cx({ child_item_image: true, child_item_bubble: hasDiscount }) } style={ { backgroundImage: 'url(' + product.image + ')'}  }>{ discounts }</span>
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
                    <p/>
                    <div className="child_item_details">
                        <div className="child_item_earn">
                            <small>You earn</small>
                            <strong>£{ displayCommission }</strong>
                        </div>
                        <div className="child_item_price">
                            <small>Price</small>
                            <strong>£{ displayPrice }</strong>
                        </div>
                        <div className="child_item_delete" onClick={ this.confirmDelete }>
                            &times;
                        </div>
                    </div>
                </div>
            );
        } else {
            item = (
                <div className="child_item_confirm">
                    <strong>Remove from basket?</strong>
                    <button onClick={ this.confirmDelete }>Nope</button>
                    <button onClick={ this.deleteProduct }>Yup</button>
                </div>
            );
        }
    	return (
            <li>
                { item }
            </li>
    	);
    },
    confirmDelete: function(e) {
        this.setState({ confirm: !this.state.confirm });
    },
    deleteProduct: function(e) {
        var flux = this.getFlux();

        this.getFlux().actions.products.remove(this.props.product.id);

        if (flux.store('ProductStore').getState().selectedProducts.length === 0) {
            this.getFlux().actions.page.update({
                page: 'masterProduct'
            });
        }
    }

});