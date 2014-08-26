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
	'leaflet',
	'core/types',
	'core/collections',
	'core/template',
	'plugins/workspace/Layer',
	],	 
function (_, L, T, C, TP, Layer) {
	'use strict';

	var BrowsedItem = T.Subview.extend({
		templateName: 'browser/item',
		ready: true,

	});


		// var Map = T.View.extend({
		// 	templateName: 'browser/map',
		// 	// ready: true,


		// 	setupMap: function(){
		// 		if(this.map) return;
		// 		var anchors = this.collectAnchors();
		// 		var mapElement = anchors.$map[0];
		// 		log.debug('setupMap', mapElement);
		// 		this.map = L.map(mapElement, {
		// 			drawControl: true,
		// 		    center: [50.8, 4.3],
		// 		    zoom: 13
		// 		});
				
		// 	},

		// 	render: function(){
		// 		TP.render(TP.name(this.template), this, function(t){
		// 			this.$el.html(t({}));
		// 			this.attachToAnchor(this.layerManager.render(), 'layers');
		// 			this.attachToAnchor(this.subscription.render(), 'groups');
		// 			this.setupMap();
		// 		});
		// 		return this;
		// 	},

		// });

		// Map.mixin(T.Overlay);


	var Browser = T.ContainerView.extend({

		templateName: 'browser/browser',
		subviewContainer : 'layers',
		SubviewPrototype: BrowsedItem,

		initialize: function(options){
			this.ready = true;
			this.cursor = C.Layer.browse(this.dataAvailable, this);
		},
	});

	return Browser;
});
