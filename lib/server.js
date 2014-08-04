/*
 * lib/server.js
 *     
 * 
 * Copyright (C) 2014  Pierre Marchand <pierremarc07@gmail.com>
 * 
 * License in LICENSE file at the root of the repository.
 *
 */



var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');



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


    /// error handlers

    // development error handler
    // will print stacktrace
    // if (app.get('env') === 'development') {
    //     app.use(function(err, req, res, next) {
    //         res.status(err.status || 500);
    //         res.render('error', {
    //             message: err.message,
    //             error: err
    //         });
    //     });
    // }

    // production error handler
    // no stacktraces leaked to user
    // app.use(function(err, req, res, next) {
    //     res.status(err.status || 500);
    //     res.send('<h1>error</h1>' 
    //         + '<p>' + err.message + '</p>'
    //         + '<p>' + err + '</p>');
    // });


    app.set('port', process.env.PORT || config.port || 3000);

    app.start = function(){
        app.use(fof);
        var server = app.listen(app.get('port'), function(){
            console.log('Express server listening on port ' + server.address().port);
        });
        return server;
    };

    return app;
};
