/*
 * lib/db.js
 *     
 * 
 * Copyright (C) 2014  Pierre Marchand <pierremarc07@gmail.com>
 * 
 * License in LICENSE file at the root of the repository.
 *
 */

var _ = require('underscore');
var knex = require('knex');
var bookshelf = require('bookshelf');
var schema = require('./schema');

var isConfigured = false;
var formatter;
var orm;



function createTables(S, names, callback){
	if(names.length === 0){
		if(callback) return callback();
		return;
	}
	var name = names.shift();

	S.createTable(name, function(T){
		console.log('>> createTable', name);

		T.increments('id').primary();

		_.each(schema[name], function(props, column){
			var pt = _.clone(props.type);
			var columnType =  pt;
			var args = [column];

			if(_.isArray(pt)){
				columnType = pt.shift();
				_.each(pt, function(p){
					args.push(p);
				});
			}

			console.log('>> column', columnType, args);
			var c = T[columnType].apply(T, args);

			if('foreign' in props){
				c.references(props.foreign[0])
				 .inTable(props.foreign[1]);
			}
		});
	})
	.then(function(arg){
		console.log('>> created', name);
		createTables(S, names, callback);
	});
};

function purgeDB(S, callback){
	var tables = [];
	_.each(schema, function(n, k){
		tables.push(formatter.wrap(k));
	});
	var statement = 'DROP TABLE IF EXISTS '+ tables.join(', ') + ' CASCADE';
	console.log('>>', statement);
	S.raw(statement)
	 .then(function(){
		callback(S);
	});
};

// function checkTable(S, name){
// 	console.log('>> checkTable', name);

// 	S.hasTable(name)
// 		.then(function(exists){
// 			console.log('>>', name, exists);
// 			if(exists){
// 				S.raw('DROP TABLE IF EXISTS '+ formatter.wrap(name) + ' CASCADE')
// 				 .then(function(){
// 					createTable(S,name);
// 				});
// 			}
// 			else{
// 				createTable(S, name);
// 			}
// 		});
// };


function loadFixtures(){
	try{
		require('./fixture');	
	}
	catch(ex){
		console.log('No fixture found', ex);
	}
};

module.exports.configure = function(config, app){
	if(!!isConfigured) return;

	var K = knex(config);
	orm = bookshelf(K);
	orm.getSchema = function(){
		return K.schema;
	};
	formatter = new K.client.Formatter;

	if(config.purge){
		purgeDB(K.schema, function(S){
			var tables = _.keys(schema);
			createTables(S, tables, loadFixtures);
		});
		
	}

	isConfigured = true;
	if(app){
		app.ORM = orm;
	}

	return orm;
};


module.exports.ORM = function(){
	if(!isConfigured){
		throw new Error('ORM not configured');
	}
	if(orm === undefined){
		throw new Error('ORM not defined, check your configuration');
	}
	return orm;
};