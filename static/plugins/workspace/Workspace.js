/*
 * workspace/Workspace.js
 *     
 * 
 * Copyright (C) 2014  Pierre Marchand <pierremarc07@gmail.com>
 * 
 * This program is free software: you can redistribute it and/or modify *
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */


define([
	'underscore',
	'core/logger',
	'core/types',
	'core/collections', 
	'leaflet', 
	'leaflet-draw', 
	'core/template'
	], 
function(_, log, T, C, L, LD, TP){


	function MapEventHandlerBase(options){
			this.map = options.map;
			this.attachHandlers();
	};
	MapEventHandlerBase.extend = T.extend;

	var MapEventHandler = MapEventHandlerBase.extend({
		
		attachHandler: function(event, handler){
			this.map.on(event, _.bind(this[handler], this));
		},

		attachHandlers: function(){
			var self = this;
			_.each(self.events, function(method, k){
				self.attachHandler(k, method);
			});
		},

		events: {
			'draw:created' : 'create',
		},

		create: function(event){
			var type = event.layerType;
        	var layer = event.layer;
        	var geoJSON = layer.toGeoJSON();
        	log.debug('create', geoJSON);

    		if (type === 'marker') {
		        // Do marker specific actions
		    }

		    // Do whatever else you need to. (save to db, add to map etc)
		    this.map.addLayer(layer);
		},

	});


	var Workspace = T.View.extend({

		className: 'workspace',
		template: 'workspace/main',

		initialize: function(options){
		
		},

		setupMap: function(){
			if(this.map) return;
			var anchors = this.collectAnchors();
			var mapElement = anchors.$map[0];
			log.debug('setupMap', mapElement);
			this.map = L.map(mapElement, {
				drawControl: true,
			    center: [50.8, 4.3],
			    zoom: 13
			});

			this.handler = new MapEventHandler({map:this.map});
		},

		render: function(){
			TP.render(TP.name(this.template), this, function(t){
				this.$el.html(t({}))
				this.setupMap();
			});
		},

	});

	return Workspace;

});
