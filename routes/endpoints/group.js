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

 		modelName: 'Group',
 		model: store.Group,

 		related: ['layers'],
 		
 		endpoints: {
 			layer: {
 				verb: 'get',
				handler: 'layer',
				url: 'Group/l/:layer_id'
 			},

 			subscribe: {
 				verb: 'put',
				handler: 'subscribe',
				url: 'Group/subscribe/:id'
 			},

 			unsubscribe: {
 				verb: 'put',
				handler: 'unsubscribe',
				url: 'Group/unsubscribe/:id'
 			},

 			attach: {
 				verb: 'put',
				handler: 'attach',
				url: 'Group/attach/:lid/:gid'
 			},

 			detach: {
 				verb: 'put',
				handler: 'detach',
				url: 'Group/detach/:lid/:gid'
 			}
 		},

 		layer: function(req, res) {
 		
 		// FIXME
 			var lid = req.params.layer_id;
 			function joinAndFilter(Q){
 				Q.innerJoin('compositions', 'groups.id', 'compositions.group_id');
 				Q.where('layer_id', '=', lid);
 				Q.column( 'groups.id', 'groups.properties');
 				console.log(Q.toString());
 			};
 		
 			var options = {
 				where: base.where(joinAndFilter),
 				page : req.query.page,
 			};

			this._list(options)
				.done(function(result){
					res.json(result);
				}, this.queryError(res));
 		},

 		subscribe: function(req, res){
 			var user = req.user;
 			var groupQuery = this._get(req.params.id, true);
 			var self = this;
 			groupQuery.done(function(group){
 				group.users().attach(user);
 				res.json(self._filterResult(group.toJSON()))
 			}, this.queryError(res))
 		},

 		unsubscribe: function(req, res){
 			var user = req.user;
 			var groupQuery = this._get(req.params.id, true);
 			var self = this;
 			groupQuery.done(function(group){
 				group.users().detach(user);
 				res.json(self._filterResult(group.toJSON()))
 			}, this.queryError(res))
 		},

 		attach: function(req, res){
 			var self = this;
 			var user = req.user;

 			var layer_id = parseInt(req.params.lid);

 			var groupQuery = self._get(req.params.gid, true);

 			groupQuery.done(function(group){
 				group.layers().fetch().then(function(glayers){
 					// console.log('Group.attach', glayers);
 					var glen = glayers.length;
 					user.layers().fetch().then(function(layers){
	 					// console.log('Group.attach', layers);
	 					layers.each(function(layer){
	 						// console.log('Group.attach.layer', layer.id === layer_id);
	 						if(layer.id === layer_id){
		 						glayers.attach({ 
		 							group_id: group.id, 
									layer_id: layer_id, 
									order: glen
								}).done(function(rel){
 									res.json(self._filterResult(group.toJSON()))
		 						});
	 						}
	 					});
		 				
	 				});

 				});
 				
 			}, this.queryError(res))
 		},

 		detach: function(req, res){
 			var self = this;
 			var user = req.user;

 			var layer_id = parseInt(req.params.lid);

 			var groupQuery = self._get(req.params.gid, true);

 			groupQuery.done(function(group){
 				user.layers().fetch().then(function(layers){
 					layers.each(function(layer){
 						if(layer.id === layer_id){
	 						group.layers().detach(layer);			
 						}
		 				res.json(self._filterResult(group.toJSON()))
 					});
 				});
 			}, this.queryError(res))
 		},


 	});
