/*
 * routes/index.js
 *     
 * 
 * Copyright (C) 2014  Pierre Marchand <pierremarc07@gmail.com>
 * 
 * License in LICENSE file at the root of the repository.
 *
 */

var express = require('express');

var store = require('../lib/store');

module.exports = exports = function(app){

	var router = express.Router();
	/* GET home page. */
	router.get('/', function(req, res) {
	  res.send('Welcome!');
	});
	app.use('/', router);

};