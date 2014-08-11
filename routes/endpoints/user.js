/*
 * routes/endpoints/user.js
 *     
 * 
 * Copyright (C) 2014  Pierre Marchand <pierremarc07@gmail.com>
 * 
 * License in LICENSE file at the root of the repository.
 *
 */



var _ = require('underscore'); 

var base = require('./base');
var store = require('../../lib/store');


module.exports = exports = base.RequestHandler.extend({

 		modelName: 'User',
 		model: store.User,

 		endpoints: {
 			me: {
 				verb: 'get',
				handler: 'getMe',
				url: 'User/me'
 			}
 		},

 		related: ['groups'],

 		filterResult: function(res){
 			return _.omit(res, 'password');
 		},

 		getMe: function(req, res){
 			if ('user' in req 
 				&& req.user) {
 				options = {
 					where : base.where('id', '=', req.user.id)
 				};
 				this._list(options)
					.done(function(model){
						res.json(model);
					}, function(err){
						res.json(404, err);
					});
 			}
 			else{
 				res.json(500, 'Your not autenticated');
 			}
 		},

 	});
