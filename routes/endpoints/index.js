/*
 * routes/endpoints/index.js
 *     
 * 
 * Copyright (C) 2014  Pierre Marchand <pierremarc07@gmail.com>
 * 
 * License in LICENSE file at the root of the repository.
 *
 */


 // testing

 var _ = require('underscore');
 var base = require('./base');
 var store = require('../../lib/store');

var handlers = []; 

var modelNames = ['User', 'Layer', 'Entity'];

 _.each(modelNames, function(modelName){

 	var RH = base.RequestHandler.extend({
 		modelName: modelName,
 		model: store[modelName],
 		filterResultList: function(res){
 			console.log('>> filterResultList');
 			var fres = [];
 			_.each(res, function(r){
 				fres.push(_.omit(r, 'password'));
 			});
 			return fres;
 		},
 	});
 	var handler = new RH;
 	console.log('>> pushing handler', handler.modelName);
 	handlers.push(handler);

 });


 module.exports = exports = handlers;
