/** @jsx React.DOM */

'use strict';

var React = require('react'),
	Fluxxor = require('fluxxor'),
	FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var cx          = require('classnames');

var CONSTANTS   = require('../../constants/constants');

var Avatar      = require('../avatar.jsx');

module.exports = React.createClass({
	displayName: 'clientsView.jsx',
	mixins: [FluxMixin, StoreWatchMixin('ClientStore')],
    getStateFromFlux: function() {
        var flux = this.getFlux();

        return {
            clients:    flux.store('ClientStore').getState().clients,
            trainer:    flux.store('AuthStore').getState().trainer,
            mode:       null
        };
    },
	componentDidMount: function() {
		window.scrollTo(0,0);
	},
    render: function() {
        var clients = (<li className="client_list_client client_list_no_clients">NO CLIENTS</li>);

        var pageClasses = {
            page: true,
            clients_view: true,
            light_blue: true,
            no_clients: (!this.state.clients || this.state.clients.length === 0)
        };

        var buttons = (
            <div className="client_list_actions">
                <a className="edit_icon" href="#" onClick={this.editClients}>Edit clients</a>
                <p/>
                <a className="delete_icon" href="#" onClick={this.deleteClients}>Select and delete clients</a>
            </div>
        );

        if (this.state.clients && this.state.clients.length > 0) {
            clients = [];

            this.state.clients.forEach(function(client) {
                var picture = (client.picture) ? { backgroundImage:'url(' + client.picture  + '?&w=52&h=52&fit=facearea&faceindex=1)' } : {};

                clients.push(
                    <li key={client.id} className="client_list_client" onClick={this.selectClient.bind(this, client)}>
                        <span style={ picture } />
                        {client.name}
                    </li>
                );
            }.bind(this));

            if (this.state.mode) {
                pageClasses[this.state.mode] = true;
                buttons = (
                    <div>
                        <button onClick={this.modeClear}>Done</button>
                    </div>
                )
            }
        }

        return (
            <div className={cx(pageClasses)}>
	            <Avatar person={this.state.trainer} />
                <h2 className="center">{this.state.trainer.name}'s clients</h2>
                <p/>
                <p className="center purple"><small>Select a client to send recommendations to:</small></p>
                <p/>
                <ul>
                    {clients}
                    <li className="client_list_client client_list_add_client add_icon add_icon_green" onClick={ this.proceedAddClient }>
                        Add a client
                    </li>
                </ul>
                <p/>
                {buttons}
                <div className="spotter_tip">
                    <em>SPOTTER TIP</em><br/>
                    Why not add yourself as a client? Test drive how Spotter works and get some great products at a discount whilst you're at it!
                </div>
            </div>
        );
    },
    selectClient: function(client, e) {
    	e.preventDefault();

        if (this.state.mode === 'delete') {
            if (window.confirm('Are you sure you want to delete ' + client.name + '?')) {
                this.getFlux().actions.client.delete({
                    client: client
                });
            }
        } else if (this.state.mode === 'edit') {
            this.getFlux().actions.client.set({
                client: client
            });

            this.getFlux().actions.page.update({
                page: 'clientEdit'
            });
        } else {
            this.getFlux().actions.client.set({
                client: client
            });
            this.getFlux().actions.page.update({
                page: 'masterProduct'
            });
        }
    },
    editClients: function(e) {
        e.preventDefault();

        this.setState({
            mode: 'edit'
        });
    },
    deleteClients: function(e) {
        e.preventDefault();

        this.setState({
            mode: 'delete'
        });
    },
    modeClear: function(e) {
        e.preventDefault();

        this.setState({
            mode: null
        });
    },
    proceedAddClient: function(e) {
        e.preventDefault();
        this.getFlux().actions.page.update({
            page: 'clientAdd'
        });
    }

});