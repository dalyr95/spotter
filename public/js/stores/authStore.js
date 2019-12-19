'use strict';

var Fluxxor = require('fluxxor');
var CONSTANTS = require('../constants/constants');

var SpotterAPI = require('../lib/spotter');

var AuthStore = Fluxxor.createStore({
    initialize: function(params) {
        this.state = {
            token:      null,
            trainer:    null
        };

        this.bindActions(
            CONSTANTS.AUTH.INIT,                this.authInitialize,
            CONSTANTS.AUTH.AUTHO.GET,           this.autho.getTrainer,
            CONSTANTS.AUTH.AUTHO.LOCK,          this.autho.createLock,
            CONSTANTS.AUTH.AUTHO.SHOW,          this.autho.show,
            CONSTANTS.AUTH.AUTHO.LOGOUT,        this.autho.logout,

            CONSTANTS.AUTH.SPOTTER.GET,         this.spotter.getTrainer,

            CONSTANTS.TRAINER.UPDATE,           this.spotter.updateTrainer,
            CONSTANTS.TRAINER.IMAGE.ADD,        this.spotter.updateTrainerImage,
            CONSTANTS.TRAINER.IMAGE.UPLOADED,   this.spotter.uploadedTrainerImage
        );
    },
    authInitialize: function() {
        var token = localStorage.getItem('token');

        if (token && window.location.hash.search('access_token') === -1) {
            this.state.token = token;

            SpotterAPI.getTrainer(function(data) {
                if (data.id) {
                    this.state.trainer = data;

                    this.flux.actions.page.update({
                        page: 'home'
                    });

                    this.flux.actions.clients.get();
                } else {
                    setTimeout(function() {
                        this.flux.actions.auth.autho.lock();
                        this.flux.actions.auth.autho.show();
                    }.bind(this));
                }
            }.bind(this));
        } else {
            setTimeout(function() {
                this.flux.actions.auth.autho.lock();
                this.flux.actions.auth.autho.show();
            }.bind(this));
        }
    },
    autho: {
        createLock: function() {
            this.state.lock = new Auth0Lock('YDvRFV8XQoX3fuF1X65l8RqMSmCKHGOg', 'fitflow.eu.auth0.com',{
                container: 'auth',
                allowedConnections: ['google-oauth2', 'facebook'],
                avatar: null,
                languageDictionary: {
                    title: 'Log in'
                },
                theme: {
                    logo: window.location.pathname + 'images/loader.png',
                    primaryColor: 'white'
                },
                auth: {
                   redirect: true,
                   responseType: 'token'
                }
            });

            this.state.lock.on('authenticated', function(authResult) {
                this.state.lock.getProfile(authResult.idToken, function(error, profile) {
                    if (error) {
                        this.signOut();
                        return;
                    }

                    this.autho.getTrainer.bind(this)(authResult, profile);
                }.bind(this));
            }.bind(this));
        },
        show: function() {
            this.state.lock.show();
        },
        getTrainer: function(authResult, profile) {
            if (!authResult.idToken) { return; }

            try {
                localStorage.setItem('token', authResult.idToken);
            } catch (e) {}

            this.state.token = authResult.idToken;

            if (this.state.token) {
                setTimeout(function() {
                    this.flux.actions.auth.spotter.get();
                }.bind(this), 0);
            }
        },
        logout: function() {
            try {
                localStorage.clear();
            } catch(e) {

            }

            window.location.href = 'https://fitflow.eu.auth0.com/v2/logout?returnTo=' + encodeURI(window.location.origin) + '&client_id=YDvRFV8XQoX3fuF1X65l8RqMSmCKHGOg';
        }
    },
    spotter: {
        getTrainer: function() {
            SpotterAPI.getTrainer(function(data) {
                if (data.id) {
                    this.state.trainer = data;

                    this.flux.actions.page.update({
                        page: 'home'
                    });

                    this.flux.actions.clients.get();

                } else if (data.code && data.description) {
                    alert(data.description);
                } else {
                    alert('Sorry, something has gone wrong!');
                }
            }.bind(this));
        },
        updateTrainer: function(payload) {
            payload.trainer.name = payload.trainer.fname + ' ' + payload.trainer.lname;

            SpotterAPI.updateTrainer(payload.trainer, function(data) {
                console.log('updateTrainer', data);
            });
        },
        updateTrainerImage: function(payload) {
            SpotterAPI.imageTrainer(payload.file, function(data) {
                this.flux.actions.trainer.image.uploaded({
                    id:     payload.id,
                    url:    data.url
                });
            }.bind(this));
        },
        uploadedTrainerImage: function(payload) {
            this.state.trainer.picture = payload.url + '?cachebust=' + Math.floor(Math.random() * 20);

            this.emit('change:trainerImageUploaded');
            this.emit('change');
        }
    },
    signOut: function() {
        localStorage.clear();

        this.state.token    = null;
        this.state.trainer  = null;
    },
    getState: function(){
        return this.state;
    }
});

module.exports = AuthStore;
