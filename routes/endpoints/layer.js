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
 		related: ['groups', 'user'],

 		endpoints: {
 			userLayers: {
 				verb: 'get',
				handler: 'userLayers',
				url: 'Layer/u/:user_id'
 			},

 			deleteLayer: {
 				verb: 'delete',
				handler: 'deleteLayer',
				url: 'Layer/:id'
 			},
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


 		deleteLayer: function(req, res){
 			var id = req.params.id;
			var model = new this.model({id:id});

			var success = _.bind(function(){
				res.status(204).end();
			}, this);

			var error = _.bind(function(err){
				res.status(403).end();
			}, this);

			var checkUser = _.bind(function(model){
				var muid = model.get('user_id');
				if(req.user.id !== muid){
					console.error('deleteLayer', req.user.id, model.user, req.user.id !== muid);
					throw (new Error('this is not yours buddy'));
				}
			}, this);

			var destroy = _.bind(function(){
				model.destroy()
					.then(success)
					.catch(error);
			}, this);

			model.on('destroying', checkUser);
			model.fetch().then(destroy);
 		},

 	});
