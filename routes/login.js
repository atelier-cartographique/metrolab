/*
 * routes/login.js
 *     
 * 
 * Copyright (C) 2014  Pierre Marchand <pierremarc07@gmail.com>
 * 
 * License in LICENSE file at the root of the repository.
 *
 */

var _ = require('underscore');

var passport = require('passport');

function processLogin(req, res){
	console.log('>> processLogin');
	res.redirect('/');
};

function renderLogin(req, res){
	res.render('login');
};

module.exports = exports = function(router, app){
	router.get('/login', renderLogin);
	router.post('/login', 
		passport.authenticate('local', { 
			failureRedirect: '/login' }),
		processLogin);
};