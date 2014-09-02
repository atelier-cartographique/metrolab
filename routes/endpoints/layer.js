/*
 * routes/endpoints/layer.js
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
 		
 		modelName: 'Layer',
 		model: store.Layer,
 		related: ['groups'],

 		endpoints: {
 			userLayers: {
 				verb: 'get',
				handler: 'userLayers',
				url: 'Layer/u/:user_id'
 			}
 		},

 		userLayers: function(req, res) {
 			var options = {
 				where: base.where('user_id', '=', req.params.user_id),
 				page : req.query.page,
 			};
			this._list(options)
				.done(function(result){
					res.json(result);
				}, function(err){
					res.json(500, err);
				});
 		},	


 	});
