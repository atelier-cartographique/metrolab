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

var ORM = require('./db').ORM();

var Geometry = ORM.Model.extend({
	geoJSONToWKT: function(geom){
		var g;
		if('geometry' in geom){
			g = geom.geometry;
		}
		else{
			g = geom;
		}
		var parsedGeometry = geoJSONReader.read(g);
		var wkt = wktWriter.write(parsedGeometry);

		return {
			'wkt': wkt,
			'geometry_type': g.type	
		};
	},

	wktToGeoJSON: function(geom){
		var parsedGeometry = geoJSONReader.read(geom);
		return parsedGeometry.toJSON();
	},

	format: function(attributes){
		var geomDict = _.result(attributes, 'geometry');
		var geom = this.geoJSONToWKT(geomDict);
		attributes.geometry = geom.wkt;
		attributes.geometry_type = geom.geometry_type;
		return attributes;
	},

	parse: function(attributes){
		var wkt = _.result(attributes, 'geometry');
		attributes.geometry = this.wktToGeoJSON(wkt);
		return attributes;
	},
});



var User = ORM.Model.extend({
	tableName: 'users',

	groups: function() {
    	return this.belongsToMany(Group)
    				.through(Subscription);
  	},

});




var Entity = Geometry.extend({
	tableName: 'entities',

	user: function(){
		return this.hasOne(User, 'user_id');
	},

	layer: function(){
		return this.hasOne(Layer, 'layer_id');
	}

});

var Layer = ORM.Model.extend({
	tableName: 'layers',

	entities: function(){
		return this.hasMany(Entity);
	},

	groups: function(){
		return this.belongsToMany(Group)
					.through(Composition);
	},
});

var Group = ORM.Model.extend({
	tableName: 'groups',

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

var Subscription = ORM.Model.extend({
	tableName : 'subscriptions',

	user: function(){
		return this.belongsTo(User);
	},

	group: function(){
		return this.belongsTo(Group);
	},
});

var Composition = ORM.Model.extend({
	tableName : 'compositions',

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
};