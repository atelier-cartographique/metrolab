/*
 * routes/endpoints/entity.js
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
 		
 		modelName: 'Entity',
 		model: store.Entity,

 		endpoints: {
 			layer: {
 				verb: 'get',
				handler: 'layer',
				url: 'Entity/l/:layer_id'
 			}
 		},

 		layer: function(req, res) {
 			var options = {
 				where: [
 					['layer_id', '=', req.params.layer_id]
 				],
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
