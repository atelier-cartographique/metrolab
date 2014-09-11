/*
 * lib/server.js
 *     
 * 
 * Copyright (C) 2014  Pierre Marchand <pierremarc07@gmail.com>
 * 
 * License in LICENSE file at the root of the repository.
 *
 */


var path = require('path');

var express = require('express'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    bodyParser = require('body-parser');

var passport = require('passport'),
    Strategy = require('passport-local').Strategy,
    User = require('./store').User,
    users = User.collection();


function verify(username, password, done){
    console.log('>> verify', username, password);
    User.where({
        'name':username, 
        'password':password
    }).fetch()
        .then(function(model){
            if(model){
                console.log('>> Got a user', model.get('name'));
                users.add(model);
                done(false, model);
            }
            else{
                console.log('>> No user');
                done({error:'wrong credentials'});
            }
        });
};

passport.serializeUser(function(user, done) {
    console.log('>> serializeUser', user.id);
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    console.log('>> deserializeUser', id);
    var user = users.get(id);
    if(user){
        done(false, user);
    }
    else{
        done('User not in collection');
    }
});

passport.use(new Strategy(verify));


/// catch 404 and forward to error handler
function fof(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
};

module.exports = function(config){

    config = config || {};
    var app = express();

    // view engine setup
    app.set('views', config.views || path.join(__dirname, '../views'));
    app.set('view engine',  config.viewEngine || 'jade');

    app.use(favicon());
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());
    app.use(cookieParser());
    app.use(express.static(config.static || path.join(__dirname, '../public')));
    app.use(session({ secret: config.secret || 'xxxxxxxxx' }));
    app.use(passport.initialize());
    app.use(passport.session());



    app.set('port', process.env.PORT || config.port || 3000);

    app.start = function(postStart){
        // app.use(fof);
        var server = app.listen(app.get('port'), function(){
            console.log('Express server listening on port ' + server.address().port);
            if(postStart){
                postStart(app, server);
            }
        });
    };

    return app;
};
