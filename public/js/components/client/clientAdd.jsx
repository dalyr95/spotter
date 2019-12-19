/** @jsx React.DOM */

'use strict';

var React = require('react'),
	Fluxxor = require('fluxxor'),
	FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var cx = require('classnames');

var CONSTANTS = require('../../constants/constants');

var Avatar = require('../avatar.jsx');

module.exports = React.createClass({
	displayName: 'clientAdd.jsx',
	mixins: [FluxMixin],
    getInitialState: function() {
        var state = {
            client: {
                fname: '',
                lname: '',
                email: '',
                phone: ''
            },
            action: (this.getFlux().store('PageStore').getState().currentPage === 'clientEdit') ? 'update' : 'add'
        };

        if (state.action === 'update') {
            state.client = this.getFlux().store('ClientStore').getState().client;
            if (!state.client.phone) {
                state.client.phone = '';
            }

            if (!state.client.fname) {
                var name = payload.client.name.split(' ');
                state.client.fname = name.shift();
                state.client.lname = name.splice(1).join(' ');
            }
        }

        return state;
    },
	componentDidMount: function() {
		window.scrollTo(0,0);
	},
    render: function() {
        var title = (this.state.action === 'add') ? 'Add a client' : 'Edit client';
        var button = (this.state.action === 'add') ? 'Add client' : 'Update client details';

        return (
            <div className="page client_edit light_blue">
                <h2 className="center">{ title }</h2>
                <p/>
                <form>
                    <label>
                        First Name
                        <input type="text" placeholder="First Name" onChange={this.update.bind(this, 'fname')} value={this.state.client.fname} />
                    </label>
                    <label>
                        Last Name
                        <input type="text" placeholder="Last Name" onChange={this.update.bind(this, 'lname')} value={this.state.client.lname} />
                    </label>
                    <label>
                        Email
                        <input type="email" placeholder="Email" onChange={this.update.bind(this, 'email')} value={this.state.client.email} />
                    </label>
                    <label>
                        Phone Number
                        <input type="tel" placeholder="Phone Number" onChange={this.update.bind(this, 'phone')} value={this.state.client.phone} />
                    </label>
                    <label htmlFor="image">
                        Upload an image
                        <input type="text" placeholder={ this.state.imagePath || 'Upload image' } className="nopointer" readOnly/>
                        <input id="image" ref="file" type="file" accept="image/*" capture="camera" onChange={ this.imageChange } />
                    </label>
	                <label>
	                	<button type="submit" onClick={this.proceed}>{button}</button>
	                </label>
                </form>
            </div>
        );
    },
    update: function(field, e) {
        var state = this.state;
        state.client[field] = e.currentTarget.value;

        this.setState(state);
    },
    proceed: function(e) {
    	e.preventDefault();

        var flux = this.getFlux();

        var missingValues = [];
        var fieldNames = {
            fname: 'first name',
            lname: 'last name',
            email: 'email'
        }

        var client = this.state.client;

        Object.keys(client).forEach(function(key) {
            if (fieldNames[key]) {
                if (!client[key] || client[key].length === 0) {
                    missingValues.push(fieldNames[key]);
                }
            }
        });

        if (missingValues.length > 0) {
            alert('Please enter ' + missingValues.join(', '));
            return;
        }

        var file = this.refs.file.files[0];

        if (file) {
            //alert('Your client image will upload in the background, you will be notified when it has finished');
            if (this.state.action === 'update') {
                flux.actions.client.image.add({
                    file:   file,
                    id:     this.state.client.id
                });
            } else {
                flux.store('ClientStore').once('change:clientAdded', function() {
                    flux.actions.client.image.add({
                        file:   file,
                        id:     this.getFlux().store('ClientStore').getState().lastAdded.id
                    });
                }.bind(this));
            }

        }

        flux.store('ClientStore').once('change:clientsGot', function() {
            flux.actions.page.update({
                page: 'clientView'
            });
        }.bind(this));

        if (this.state.action === 'update') {
            client.name = client.fname + ' ' + client.lname;
        }

        flux.actions.client[this.state.action]({
            client: client
        });
    },
    imageChange: function(e) {
        var img = e.currentTarget.value.split('\\');
        this.setState({
            imagePath: img[img.length - 1]
        });
    }

});