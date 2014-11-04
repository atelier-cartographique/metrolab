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

function increment(a){
	a = a + 1;
	return a;
};

function decrement(a){
	a = a - 1;
	return a;
};

module.exports = exports = base.RequestHandler.extend({

 		modelName: 'Group',
 		model: store.Group,

 		related: ['layers'],
 		
 		endpoints: {
 			// browse: {
 			// 	verb: 'get',
				// handler: 'list',
				// url: 'Group/'
 			// },

 			own: {
 				verb: 'get',
				handler: 'ownGroups',
				url: 'Group/u'
 			},

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
 			},

 			moveLayer: {
 				verb: 'put',
				handler: 'moveLayer',
				url: 'Group/move/:gid/:lid/:index'
 			}
 		},

 		listOptions: function(req){
 			var w0 = base.where('status_flag', '=', 0);
 			return {where:w0};
 		},

 		ownGroups: function(req, res){
 			var user = req.user;
 			var options = { where: base.where('user_id', '=', user.id)};
 			options.page = req.query.page;
			this._list(options)
				.done(function(result){
					res.json(result);
				}, function(err){
					res.json(500, err);
				});
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

 		moveLayer: function(request, response){
 			var self = this;
 			var user = request.user;
 			var index = parseInt(request.params.index);
 			var layerId = parseInt(request.params.lid);
 			var groupId = parseInt(request.params.gid);

 			var updateLayerRecord = function(layerRecord, newOrder){
 				
				layerRecord.set({order: newOrder})
					.save()
					.done();	
 			};

 			var updateLayers = function(layers){
 				_.each(layers, function(layer){
 					store.Composition.where({
 						layer_id: layer.id,
 						group_id: groupId
 					}).fetch()
 						.then(function(lrs){
 							var layerRecord = _.find(lrs, function(lr){
 								return lr.layer_id === layer_id;
 							});

 							var from = layerRecord.get('order');
 							var op = (index > from) ? decrement : increment;
 							var interval = [Math.min(from,index), Math.max(from,index)];
 							var toMove = _.filter(lrs, function(lr){
 								var o = lr.get('order');
 								if(o < interval[0] 
 									|| o > interval[1] 
 									|| lr.id === layerRecord.id){
 									return false;
 								}
 								return true;
 							});

 							_.each(toMove, function(lr){
 								var o = lr.get('order');
 								updateLayerRecord(lr, op(o));
 							});

 							layerRecord.set({order: index})
								.save()
								.done(function(lr){
									response.json(200, lr.toJSON());
								});
 						}) ;
 				});
 			};

 			self._get(request.params.gid, true)
 				.done(function(group){
 					if(group.user_id !== user.id){
 						return response.json(403, {});
 					}
 					group.layers()
 						.fetch()
 						.then(updateLayers);
 				}, self.queryError(response))
 		}
 	});
