/** @jsx React.DOM */

'use strict';

var React = require('react'),
	Fluxxor = require('fluxxor'),
	FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var cx = require('classnames');

var CONSTANTS = require('../constants/constants');

var Avatar      = require('./avatar.jsx');
var SearchBar   = require('./searchBar.jsx');

module.exports = React.createClass({
    mixins: [FluxMixin],
	displayName: 'home.jsx',
	componentDidMount: function() {
		window.scrollTo(0,0);
	},
    getInitialState: function() {
        return {
            trainer: this.getFlux().store('AuthStore').getState().trainer
        };
    },
    render: function() {
        return (
            <div className="page signin">
                <Avatar person={this.state.trainer} />
                <h2 className="center">Welcome back {this.state.trainer.name}</h2>
                <p/>
                <form>
                    <label>
                        <button type="submit" onClick={this.proceedAddClient}>Add Client</button>
                    </label>
                    <label>
                        <button type="submit" onClick={this.proceedViewClients}>View Clients</button>
                    </label>
	                <label>
	                	<button type="submit" onClick={this.proceedSettings}>Settings</button>
	                </label>
                </form>
            </div>
        );
    },
    proceedAddClient: function(e) {
    	e.preventDefault();
    	this.getFlux().actions.page.update({
    		page: 'clientAdd'
    	});
    },
    proceedViewClients: function(e) {
        e.preventDefault();
        this.getFlux().actions.page.update({
            page: 'clientView'
        });
    },
    proceedSettings: function(e) {
        e.preventDefault();
        this.getFlux().actions.page.update({
            page: 'settings'
        });
    },

});