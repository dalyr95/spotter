/** @jsx React.DOM */

'use strict';

var React = require('react'),
	Fluxxor = require('fluxxor'),
	FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var cx = require('classnames');

var CONSTANTS = require('../constants/constants');

module.exports = React.createClass({
	displayName: 'trainerDetails.jsx',
	mixins: [FluxMixin],
	componentDidMount: function() {
		window.scrollTo(0,0);
	},
    render: function() {
        return (
            <div className="page settings">
	            <div className="user_avatar"></div>
                Settings
                <form>
                    <label>
                        First Name
                        <input type="text" placeholder="First Name" />
                    </label>
                    <label>
                        Last Name
                        <input type="text" placeholder="Last Name" />
                    </label>
                    <label>
                        Upload an image
                        <input type="file" accept="image/*" capture="camera" />
                    </label>
                    <label>
                        <button type="submit" onClick={this.proceed}>Update details</button>
                    </label>
                </form>
            </div>
        );
    },
    proceed: function(e) {
    	e.preventDefault();

        this.getFlux().actions.page.update({
            page: 'home'
        });
    }

});