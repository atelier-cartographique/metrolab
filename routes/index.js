/*
 * routes/index.js
 *     
 * 
 * Copyright (C) 2014  Pierre Marchand <pierremarc07@gmail.com>
 * 
 * License in LICENSE file at the root of the repository.
 *
 */

var _ = require('underscore');
var express = require('express');

var routes = ['login', 'config', 'api'];

module.exports = exports = function(app){

	var router = express.Router();
	_.each(routes, function(route){
		require('./'+route)(router, app);
	});

	/* GET home page. */
	router.get('/*', function(req, res) {
		if (req.isAuthenticated()) { 
	  		res.render('index');
		}
		else{
			res.redirect('/login');
		}
	});

	app.use('/', router);

};