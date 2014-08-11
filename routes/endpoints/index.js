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

var modelNames = ['user', 'layer', 'entity', 'group'];

 _.each(modelNames, function(modelName){

 	var RH = require('./'+modelName);
 	var handler = new RH;
 	console.log('>> pushing handler', handler.modelName);
 	handlers.push(handler);

 });


 module.exports = exports = handlers;
