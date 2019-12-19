/** @jsx React.DOM */

'use strict';

var React 	= require('react');
var cx 		= require('classnames');


module.exports = React.createClass({
	displayName: 'avatar.jsx',
    render: function() {
		var avatarClasses = {
			user_avatar: true
		};
		var avatarInlineCSS = {};

		if (this.props.person && this.props.person.picture) {
			avatarClasses.user_selected		= true;
			avatarInlineCSS.backgroundImage = 'url(' + this.props.person.picture + '?&w=224&h=224&fit=crop)';
		}

        return (
	        <div className={cx(avatarClasses)} style={avatarInlineCSS}></div>
        );
    }
});