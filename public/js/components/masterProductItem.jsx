/** @jsx React.DOM */

'use strict';

var React = require('react'),
    Fluxxor = require('fluxxor'),
    FluxMixin = Fluxxor.FluxMixin(React);

var CONSTANTS = require('../constants/constants');

module.exports = React.createClass({
    displayName: 'masterProductItem.jsx',
    mixins: [FluxMixin],
    render: function() {
        var masterProduct = this.props.masterProduct;

        var discount, image, commission;

        if (masterProduct.extra) {
            if (masterProduct.extra.discount) {
                if (masterProduct.extra.discount.discount_type === 'percent') {
                    discount = (
                        <span className="master_product_offer">{ masterProduct.extra.discount.value }% OFF</span>
                    );
                }
            } else if (masterProduct.extra.minPrice) {
                discount = (
                    <span className="master_product_offer">from £{ masterProduct.extra.minPrice }</span>
                );
            }

            if (masterProduct.extra.maxCommission) {
                var maxCommission = masterProduct.extra.maxCommission;

                if (Number.isInteger && Number.isInteger(masterProduct.extra.maxCommission) === false) {
                    maxCommission = masterProduct.extra.maxCommission.toFixed(2);
                } else {
                    maxCommission = masterProduct.extra.maxCommission.toFixed(2);
                }

                commission = (
                    <span className="master_product_earn">
                        EARN UP TO<br/>
                        £{ maxCommission }
                    </span>
                );
            }
        }

        if (masterProduct.image) {
            var backgroundImage = { backgroundImage : 'url(' + masterProduct.image + '?&w=60&h=120&crop=focalpoint&fit=crop&mask=corners&fm=png32)' };
            image = (<span className="master_product_img" style={ backgroundImage } ></span>);
        }

    	return (
            <li key={ masterProduct.id } onClick={ this.selectedMaster }>
                { image }
                <strong>{ masterProduct.name } ({ masterProduct.deals })</strong>
                { discount }
                { commission }
            </li>
    	);
    },
    selectedMaster: function(e) {
        var flux = this.getFlux();

        flux.actions.masterProducts.selected({
            masterProduct: this.props.masterProduct
        });

        flux.actions.childProducts.get({
            id: this.props.masterProduct.id,
            value: this.props.value
        });

        flux.actions.page.update({
            page: 'product'
        });
    }

});