/*
 * browser/Browser.js
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
	'underscore',
	'config',
	'leaflet',
	'core/types',
	'core/collections',
	'core/template',
	'plugins/browser/Layer',
	],	 
function (_, config, L, T, C, TP, Layer) {
	'use strict';
	
	// var BrowseLayer = Layer.extend({
	// 	template: 
	// });

	var LayerItem = T.Subview.extend({
		templateName: 'browser/layer-item',
		ready: true,
		className: "list-group-item",

		events: {
			'click [data-role=select]' : 'select',
		},

		viewEvents:{
			'rendered' : 'tooltips',
		},

		select: function(){
			this.trigger('select:layer', this.model);
		},

		tooltips: function(){
	        this.$el.tooltip({selector: '[data-toggle="tooltip"]'});
		}

	});

	var UserItem = T.ContainerView.extend({
		templateName: 'browser/user-item',
		subviewContainer : 'layers',
		SubviewPrototype: LayerItem,
		className: "BrowserUserItem",


		initialize: function(options){
			this.ready = true;
			this.cursor = C.Layer.forUser(this.model.id, this.dataAvailable, this);
		},

		viewEvents: {
			'include:view': 'listenLayer',
		},

		listenLayer: function(layerItem){
			layerItem.on('select:layer', function(model){
				this.trigger('select:layer', model);
			}, this);
		},

	});

	var mapDefaults = {
		center: [0,0],
		crs : 'EPSG4326',
		zoom: 10,
	}

	var Browser = T.ContainerView.extend({

		templateName: 'browser/browser',
		subviewContainer : 'users',
		SubviewPrototype: UserItem,
		className: "BrowserView",


		setupMap: function(){
			if(this.map) return;
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
		},

		initialize: function(options){
			this.ready = true;
			this.cursor = C.User.browse(this.dataAvailable, this);
			this.on('rendered', this.setupMap, this); 
		},


		viewEvents: {
			'include:view': 'listenUser',
		},

		listenUser: function(userItem){
			userItem.on('select:layer', this.showLayer, this);
			userItem.on('zoom:layer', this.zoomToLayerExtent, this);
		},

		showLayer: function(model){
			if(this.CurrentLayer){
				this.CurrentLayer.remove()
			};

			this.CurrentLayer = new Layer({model:model,map:this.map});
		},

		zoomToLayerExtent: function(){
			if(this.CurrentLayer 
				&& this.CurrentLayer.zoomLayer){
				this.CurrentLayer.zoomLayer();
			}
		},

	});

	return Browser;
});
