/** @jsx React.DOM */

'use strict';

var React = require('react'),
	Fluxxor = require('fluxxor'),
	FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var cx = require('classnames');

var CONSTANTS = require('../constants/constants');

module.exports = React.createClass({
	displayName: 'signIn.jsx',
	mixins: [FluxMixin],
    getInitialState: function() {
        return {
            opacity: 0
        };
    },
	componentDidMount: function() {
		window.scrollTo(0,0);

        setTimeout(function() {
            this.getFlux().actions.auth.init();
        }.bind(this));
	},
    render: function() {
        return (
            <div className="page signin light_blue">
                <div className="signin_header">
                    <picture>
                        <source srcSet="images/signin_splash.webp" type="image/webp" />
                        <source srcSet="images/signin_splash.jpg" type="image/jpeg" /> 
                        <img src="images/signin_splash.jpg" onLoad={ this.splashLoad } style={ { opacity: this.state.opacity } }/>
                    </picture>
                </div>
                <h1 className="center">Log In</h1>
                <p/>
                <div id="auth"></div>
            </div>
        );
    },
    splashLoad: function() {
        this.setState({
            opacity: 1
        });
    }

});