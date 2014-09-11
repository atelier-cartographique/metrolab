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


var base = require('./base'),
 	store = require('../../lib/store')
 	Queue = require('../../lib/queue');


var notify = _.partial(Queue.PUB, 'notify');

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

 		initialize: function(){
 			this.on('post:'+ this.modelName, _.bind(this.notifyPost, this));
 		},

 		layer: function(req, res) {
 			var options = {
 				where: base.where('layer_id', '=', req.params.layer_id),
 				page : req.query.page,
 			};

			this._list(options)
				.done(function(result){
					res.json(result);
				}, function(err){
					res.json(500, err);
				});
 		},


 		notifyPost: function(attrs){
 			console.log('Entity.notifyPost', attrs);

 			 	var layer = new store.Layer({
 			 		id: attrs.layer_id
 			 	});

 			 	layer.fetch()
 			 		.then(function(layer){
 			 			layer.load(['groups.users'])
 			 				 .then(function(layer){
 			 				 	var model = layer.toJSON();
 			 				 	_.each(model.groups, function(g){
 			 				 		_.each(g.users, function(u){
 			 				 			var message = {
 			 				 				channel: 'Entity',
 			 				 				id: attrs.id,
 			 				 				action: 'POST',
 			 				 			};
 			 				 			notify(message, u.id);
 			 				 		});
 			 				 	});
 			 				 });
 			 		});

 		},

 	});
