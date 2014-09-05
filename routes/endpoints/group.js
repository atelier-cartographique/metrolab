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
 			}


 			subscribe: {
 				verb: 'post',
				handler: 'subscribe',
				url: 'Group/:id/subscribe'
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
 			var groupQuery = this._get(req.params.id);
 			groupQuery.done(function(group){
 				group.users().attach(user);
 			}, this.queryError(res))
 		},


 	});
