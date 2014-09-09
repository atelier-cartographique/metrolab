/*
 * display/Display.js
 *     
 * 
 * Copyright (C) 2014  Pierre Marchand <pierremarc07@gmail.com>
 * 
 * This program is free software: you can redistribute it and/or modify 
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
	'core/logger',
	'underscore',
	'config',
	'leaflet',
	'core/eproxy',
	'core/types',
	'core/collections',
	'core/template',
	'plugins/display/Layer',
	],	 
function (log, _, config, L, proxy, T, C, TP, Layer) {
	'use strict';


	var LayerItem = T.Subview.extend({
		templateName: 'display/layer-item',
		ready: true,
		className: "list-group-item",

		events: {
			'click [data-role=zoom]' : 'zoom',
			'click [data-role=subscribe]' : 'subscribe',
		},

		viewEvents:{
			'rendered' : 'tooltips',
		},

		templateData:function (){
			var data = this.model.toJSON();
			data.active = this.active;
			return data;
		},



		zoom: function(){
			this.trigger('zoom:layer');
		},

		subscribe: function(e){
			var data = this.collectEventData(e);
			if('id' in data){
				C.Group.subscribe(data.id, function(model){
					proxy.delegate('Subscription', 'addGroup', model);
				});
			}
		},

		tooltips: function(){
	        this.$el.tooltip({selector: '[data-toggle="tooltip"]'});
		}

	});


	var mapDefaults = {
		center: [0,0],
		crs : 'EPSG4326',
		zoom: 10,
	}

	var Display = T.View.extend({

		template: 'display/display',
		className: "display",


		initialize: function(options){
			this.ready = true;
			this.on('rendered', this.setupMap, this); 
		},

		setupMap: function(){
			if(this.map){
				this.map.remove();
			}
			var mapConfig = _.defaults(_.extend({}, config.map), mapDefaults);
			var anchors = this.collectAnchors();
			var mapElement = anchors.$map[0];
			this.map = L.map(mapElement, {
			    center: mapConfig.center,
			    crs: L.CRS[mapConfig.crs],
			    zoom: mapConfig.zoom,
			});
			if('base' in mapConfig){
				var base = mapConfig.base;
				if('tile' === base.type){
					this.baseLayer = L.tileLayer(base.url, base.options).addTo(this.map);
				}
			}
			log.debug('Display.setupMap');
			this.trigger('map:rendered');
		},

		render: function(){
			var data = this.group ? this.group.toJSON() : {};
			var props = ('properties' in data) ? data.properties : {};

			TP.render(TP.name(this.template), this, function(t){
				log.debug('Display.render');
				this.$el.html(t(props));
			});
			return this;
		},

		load: function(mapId){
			log.debug('Display.load', mapId);
			if(!this.map){
				this.once('map:rendered', function(){
					this.load(mapId);
				}, this);
				return;
			}
			var self = this;
			C.Group.getOrCreate(mapId, function(model){
				log.debug('Display.load.model', model);
				self.group = model;
				self.render();
			});
		},

		zoomToLayerExtent: function(){
			if(this.CurrentLayer 
				&& this.CurrentLayer.zoomLayer){
				this.CurrentLayer.zoomLayer();
			}
		},

	});

	return Display;
});
