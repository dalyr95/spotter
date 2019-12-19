/** @jsx React.DOM */

'use strict';

var React = require('react');

var SearchBarResult = require('./searchBarResult.jsx');

module.exports = React.createClass({
    render: function() {
    	var results = [];

    	this.props.matches.forEach(function(result) {
    		results.push(
    			<SearchBarResult key={result[this.props.reactKeys || this.props.keys]} result={result} className="searchbar_result" onSelectedAction={this.props.onSelectedAction} />
    		);
    	}.bind(this));

        return (
        	<ul className="searchbar">
        		{results}
        	</ul>
        );
    }

});