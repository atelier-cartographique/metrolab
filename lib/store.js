/*
 * lib/store.js
 *     
 * 
 * Copyright (C) 2014  Pierre Marchand <pierremarc07@gmail.com>
 * 
 * License in LICENSE file at the root of the repository.
 *
 */

var _ = require('underscore');

var geos = require('geos'),
	geoJSONReader = new geos.GeoJSONReader,
	geoJSONWriter = new geos.GeoJSONWriter,
	wktReader = new geos.WKTReader,
	wktWriter = new geos.WKTWriter;

var Schema = require('./schema'),
    ORM = require('./db').ORM();

function attributes(tableName){
	return _.keys(_.extend({id:null}, Schema[tableName]));
};

var Model  = ORM.Model.extend({
  initialize: function() {
    this.on('saving', this.validateSave, this);
  },
  
  filterAttributes: function(attrs){
  	return _.pick(attrs, this._validAttributes);
  },
  
  parse: function(attrs){
  	var fattrs = this.filterAttributes(attrs); 
  	console.log('parse',this.tableName+':', this._validAttributes, attrs, fattrs);
  	return fattrs;
  },
  
  validateSave: function() {
    return true; // TODO
  },
  
});

var Geometry = Model.extend({
	geoJSONToWKT: function(geom){
		console.log('Geometry.geoJSONToWKT', this.id, typeof geom);
		// if(!geom) return '';

		if(_.isString(geom)) return geom;
		var g;
		if('geometry' in geom){
			g = geom.geometry;
		}
		else{
			g = geom;
		}
		var parsedGeometry = geoJSONReader.read(g);
		var wkt = wktWriter.write(parsedGeometry);

		return wkt;
	},

	wktToGeoJSON: function(geom){
		//if(!geom) return {};
		//console.log('Geometry.wktToGeoJSON', this.id, typeof geom);
		if(_.isObject(geom)) return geom;
		var parsedGeometry = wktReader.read(geom);
		return parsedGeometry.toJSON();
	},

	format: function(attributes){
		// console.log('Geometry.format', this.id, _.result(attributes, 'geometry'));
		var geomDict = _.result(attributes, 'geometry');
		if(geomDict){
			attributes.geometry = this.geoJSONToWKT(geomDict);
		}
		return attributes;
	},

	parse: function(attributes){
		//console.log('Geometry.parse', this.id, typeof _.result(attributes, 'geometry'));
		attributes = this.filterAttributes(attributes);
		var wkt = _.result(attributes, 'geometry');
		if(wkt){
			attributes.geometry = this.wktToGeoJSON(wkt);
		}
		return attributes;
	},
});



var User = Model.extend({
	tableName: 'users',
	_validAttributes: attributes('users'),

	groups: function() {
    	return this.belongsToMany(Group)
    				.through(Subscription);
  	},

  	layers: function(){
  		return this.hasMany(Layer);
  	},

  	toJSON: function(options){
  		// weak
  		var obj = ORM.Model.prototype.toJSON.apply(this, [options]);
  		return _.omit(obj, 'password');
  	},

});




var Entity = Geometry.extend({
	tableName: 'entities',
	_validAttributes: attributes('entities'),

	user: function(){
		return this.belongsTo(User, 'user_id');
	},

	layer: function(){
		return this.belongsTo(Layer, 'layer_id');
	}

});

var Layer = Model.extend({
	tableName: 'layers',
	_validAttributes: attributes('layers'),

	entities: function(){
		return this.hasMany(Entity);
	},

	groups: function(){
		return this.belongsToMany(Group)
					.through(Composition);
	},

	user: function() {
	    return this.belongsTo(User, 'user_id');
	},
});


var Group = Model.extend({ // Also referred as a Map
	tableName: 'groups',
	_validAttributes: attributes('groups'),

	layers: function(){
		return this.belongsToMany(Layer)
					.through(Composition);
	},

	users: function(){
		return this.belongsToMany(User)
					.through(Subscription);
	},
});



// Intermediate tables

var Subscription = Model.extend({
	tableName : 'subscriptions',
	_validAttributes: attributes('subscriptions'),

	user: function(){
		return this.belongsTo(User);
	},

	group: function(){
		return this.belongsTo(Group);
	},
});

var Composition = Model.extend({
	tableName : 'compositions',
	_validAttributes: attributes('compositions'),

	layer: function(){
		return this.belongsTo(Layer);
	},

	group: function(){
		return this.belongsTo(Group);
	},
});


module.exports = exports = {
	User : User,
	Entity : Entity,
	Layer: Layer,
	Group: Group,
	Subscription: Subscription,
	Composition: Composition
};
