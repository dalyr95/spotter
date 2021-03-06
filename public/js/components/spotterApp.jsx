/** @jsx React.DOM */

'use strict';

var React				= require('react'),
	Fluxxor				= require('fluxxor'),
	FluxMixin			= Fluxxor.FluxMixin(React),
    StoreWatchMixin		= Fluxxor.StoreWatchMixin;

var ClientAdd			= require('./client/clientAdd.jsx'),
	ClientsView			= require('./client/clientsView.jsx'),
	Confirmation		= require('./confirmation.jsx'),
	Email				= require('./email.jsx'),
	Header				= require('./header.jsx'),
	Home				= require('./home.jsx'),
	Profile				= require('./profile.jsx'),
	Product				= require('./product.jsx'),
	SignIn				= require('./signIn.jsx'),
	Settings			= require('./settings.jsx'),
	Success				= require('./success.jsx'),
	User				= require('./user.jsx');

module.exports = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin('PageStore')],
	getInitialState: function() {
		return {};
	},
	getStateFromFlux: function() {
		var flux = this.getFlux();

		return {
			page: flux.store('PageStore').getState()
		};
	},
	componentWillMount: function() {
		console.log('componentWillMount');
        this.getFlux().actions.auth.autho.lock();
        this.getFlux().actions.auth.autho.get();
	},
	componentWillUpdate: function() {
		console.log('componentWillUpdate');
	},
    render: function() {
		var page;

		switch(this.state.page.currentPage) {
		    case 'clientAdd':
		        page = (<ClientAdd />);
		        break;
		    case 'clientEdit':
		        page = (<ClientAdd />);
		        break;
		    case 'clientView':
		        page = (<ClientsView />);
		        break;
		    case 'confirmation':
		        page = (<Confirmation />);
		        break;
		    case 'email':
		        page = (<Email />);
		        break;
		    case 'home':
		        page = (<Home />);
		        break;
		    case 'product':
		        page = (<Product />);
		        break;
		    case 'profile':
		        page = (<Profile />);
		        break;
		    case 'settings':
		        page = (<Settings />);
		        break;
		    case 'success':
		        page = (<Success />);
		        break;
		    case 'user':
		        page = (<User />);
		        break;
		    default:
		        page = (<SignIn />);
		}

        return (
            <div>
            	<Header />
            	{page}
            </div>
        );
    }

});