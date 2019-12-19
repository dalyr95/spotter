'use strict';

var Fluxxor = require('fluxxor');
var CONSTANTS = require('../constants/constants');

var SpotterAPI = require('../lib/spotter');

var ClientStore = Fluxxor.createStore({
    initialize: function(params) {
        this.state = {
            clients: []
        };
        /*
        this.state = {
            clients: [
                {
                    name: 'Robert Daly',
                    fname: 'Robert',
                    lname: 'Daly',
                    id: 1,
                    trainer: 'Zeus',
                    avatar: 'rob',
                    email: 'robert@gmail.com'
                },
                {
                    name: 'Jan Konieczny',
                    fname: 'Jan',
                    lname: 'Konieczny',
                    id: 173829,
                    trainer: 'Zeus',
                    avatar: 'jan',
                    email: 'jan@hotmail.com'
                },
                {
                    name: 'Julia Stent',
                    fname: 'Julia',
                    lname: 'Stent',
                    id: 3,
                    trainer: 'Zeus',
                    avatar: 'julia',
                    email: 'julia@gmail.com'
                },
                {
                    name: 'Arnold Schwarzenegger',
                    fname: 'Arnold',
                    lname: 'Schwarzenegger',
                    id: 173830,
                    trainer: 'Zeus',
                    avatar: 'arnold',
                    email: 'arnold@yahoo.com'
                }
            ]
        };
        */

        this.bindActions(
            CONSTANTS.CLIENT.ADD,               this.clientAdd,
            CONSTANTS.CLIENT.DELETE,            this.clientDelete,
            CONSTANTS.CLIENT.UPDATE,            this.clientUpdate,
            CONSTANTS.CLIENT.IMAGE.ADD,         this.clientImageAdd,
            CONSTANTS.CLIENT.IMAGE.UPLOADED,    this.clientImageUploaded,
            CONSTANTS.CLIENT.SET,               this.clientsSet,
            CONSTANTS.CLIENTS.GET,              this.clientsGet,

            CONSTANTS.EMAIL.SEND,               this.clientSendEmail
        );
    },
    getState: function(){
        return this.state;
    },
    clientAdd: function(payload) {
        payload.client.name = payload.client.name || payload.client.fname + ' ' + payload.client.lname;

        SpotterAPI.addClient(payload.client, function(data) {
            this.state.lastAdded = data;
            this.flux.actions.clients.get();

            this.emit('change:clientAdded');
            this.emit('change');
        }.bind(this));
    },
    clientDelete: function(payload) {
        this.state.clients = this.state.clients.filter(function(client) {
            return (client.id !== payload.client.id);
        });

        SpotterAPI.deleteClient(payload.client, function(data) {
            console.log(data);
        });

        this.emit('change');
    },
    clientUpdate: function(payload) {
        payload.client.name = payload.client.name || payload.client.fname + ' ' + payload.client.lname;

        SpotterAPI.updateClient(payload.client, function(data) {
            this.flux.actions.clients.get();

            this.emit('change:clientUpdated');
            this.emit('change');
        }.bind(this));
    },
    clientsGet: function() {
        SpotterAPI.getClients(function(data) {
            if (data.total && data.total > 0) {
                this.state.clients = data.data.sort(function(a, b) {
                    if(a.name < b.name) return -1;
                    if(a.name > b.name) return 1;
                    return 0;
                });
            }
            this.emit('change:clientsGot');
            this.emit('change');
        }.bind(this));

        this.emit('change');
    },
    clientsSet: function(payload) {
        var name = payload.client.name.split(' ');
        payload.client.fname = name.shift();
        payload.client.lname = name.join(' ');

        this.state.client = payload.client;

        this.emit('change');
    },
    clientImageAdd: function(payload) {
        SpotterAPI.imageClient(payload.id, payload.file, function(data) {
            console.log(payload.file);
            this.flux.actions.client.image.uploaded({
                id:     payload.id,
                url:    data.url
            });
        }.bind(this));
    },
    clientImageUploaded: function(payload) {
        this.state.clients.map(function(client) {
            if (payload.id === client.id) {
                client.picture = payload.url;
            }
        });

        this.emit('change:clientImageUploaded');
        this.emit('change');
    },
    clientSendEmail: function() {
        var flux        =   this.flux;
        var client_id   =   flux.store('ClientStore').getState().client.id;
        var products    =   flux.store('ProductStore').getState().selectedProducts.map(function(product){
                                return product.id;
                            });

        var data = {
            client_id: client_id,
            products: products
        };

        SpotterAPI.sendClientEmail(data, function() {
            console.log('EMAIL SENT');
        });

        this.emit('change:clientEmailSending');
        this.emit('change');
    }
});

module.exports = ClientStore;
