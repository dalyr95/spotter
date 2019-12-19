/** @jsx React.DOM */

'use strict';

var React = require('react'),
	Fluxxor = require('fluxxor'),
	FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var cx = require('classnames');

var CONSTANTS   = require('../constants/constants');

var Avatar      = require('./avatar.jsx');

module.exports = React.createClass({
	displayName: 'profile.jsx',
	mixins: [FluxMixin],
    getInitialState: function() {
        var trainer = this.getFlux().store('AuthStore').getState().trainer;
        var name = trainer.name.split(' ');
        trainer.fname = name.shift();
        trainer.lname = name.join(' ');

        if (!trainer.phone) {
            trainer.phone = '';
        }

        return {
            trainer: trainer
        };
    },
	componentDidMount: function() {
		window.scrollTo(0,0);
	},
    render: function() {
        return (
            <div className="page profile light_blue">
                <Avatar person={this.state.trainer} />
                <form>
                    <label>
                        First Name
                        <input type="text" placeholder="First Name" onChange={this.update.bind(this, 'fname')} value={this.state.trainer.fname} />
                    </label>
                    <label>
                        Last Name
                        <input type="text" placeholder="Last Name" onChange={this.update.bind(this, 'lname')} value={this.state.trainer.lname} />
                    </label>
                    <label>
                        Email
                        <input type="email" placeholder="Email" onChange={this.update.bind(this, 'email')} value={this.state.trainer.email} disabled />
                    </label>
                    <label>
                        Phone Number
                        <input type="tel" placeholder="Phone Number" onChange={this.update.bind(this, 'phone')} value={this.state.trainer.phone} />
                    </label>
                    <label htmlFor="image">
                        Upload an image
                        <input type="text" placeholder={ this.state.imagePath || 'Upload image' } className="nopointer" readOnly/>
                        <input id="image" ref="file" type="file" accept="image/*" capture="camera" onChange={ this.imageChange } />
                    </label>
	                <label>
	                	<button type="submit" onClick={this.proceed}>Update trainer details</button>
	                </label>
                </form>
            </div>
        );
    },
    update: function(field, e) {
        var state = this.state;
        state.trainer[field] = e.currentTarget.value;

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

        var trainer = this.state.trainer;

        Object.keys(trainer).forEach(function(key) {
            if (fieldNames[key]) {
                if (!trainer[key] || trainer[key].length === 0) {
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
            flux.actions.trainer.image.add({
                file:   file,
                id:     this.state.trainer.id
            });
        }

        flux.actions.trainer.update({
            trainer: trainer
        });

        flux.actions.page.update({
            page: 'home'
        });
    },
    imageChange: function(e) {
        var img = e.currentTarget.value.split('\\');
        this.setState({
            imagePath: img[img.length - 1]
        });
    }

});