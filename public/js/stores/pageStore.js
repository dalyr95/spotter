'use strict';

var Fluxxor = require('fluxxor');
var CONSTANTS = require('../constants/constants');

var PageStore = Fluxxor.createStore({
    initialize: function(params) {
        this.state = {
            currentPage:    'signin',
            pages:          ['signin', 'user', 'masterProduct', 'product', 'confirmation', 'success'],
            userNames: {
                clientEdit: 'Clients',
                masterProduct: 'Clients',
                product: 'Search',
                confirmation: 'Products'
            },
            routes: {
                clientAdd: '/page/add',
                clientView: '/page/client',
                clientEdit: '/page/client/edit',
                masterProduct: '/page/product/master',
                product: '/page/product',
                profile: '/page/profile',
                confirmation: '/page/confirm',
                success: '/page/success'
            }
        };

        this.bindActions(
            CONSTANTS.PAGE.GOBACK, this.goBack,
            CONSTANTS.PAGE.UPDATE, this.updatePage
        );

        window.history.replaceState(this.state, null, '/' + window.location.hash);

        window.onpopstate = function(event) {
            if (event.state) {
                this.state = event.state;

                this.emit('change');
            }
        }.bind(this);
    },
    getState: function(){
        return this.state;
    },
    updatePage: function(payload) {
        this.state.currentPage = payload.page;

        this.emit('change');

        var page = this.state.routes[this.state.currentPage] || '/';

        window.history.pushState(this.state, null, page);
    },
    goBack: function() {
        var newPage;

        var structure = {
            clientEdit: 'clientView',
            masterProduct: 'clientView',
            product: 'masterProduct',
            confirmation: 'product'
        };

        newPage = structure[this.state.currentPage];

        this.state.currentPage = (newPage) ? newPage : 'home';

        var page = this.state.routes[this.state.currentPage] || '/';
        window.history.replaceState(this.state, null, page);

        this.emit('change');
    }
});

module.exports = PageStore;
