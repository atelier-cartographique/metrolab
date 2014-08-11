/*
 * workspace/LayerManager.js
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
	'core/types',
	'core/collections',
	'plugins/workspace/Layer'
	],	 
function (_, T, C, Layer) {
	'use strict';

	var LayerManager = T.View.extend({

		template: 'workspace/layer-widget',

		initialize: function(options){
			this.layers = [];
			this.currentLayer = undefined;
			this.ready = false;

		},

		start: function(map, user){
			this.map = map;
			C.Layer.forUser(user.id, this.addLayers, this);
		},

		addLayers: function(data){
			console.log(data);
			_.each(data.references, this.renderLayerItem.bind(this));
		},

		renderLayerItem: function(layer){
			var layerItem = new Layer({
				model:layer,
				map:this.map,
			}); 
			this.layers.push(layerItem);
			this.$el.append(layerItem.render().$el);
			var self = this;
			layerItem.on('select', function(l){
				_.each(self.layers, function(ly){
					if(ly !== l) ly.deselectLayer();
				});
				self.currentLayer = l;
			});

			if(!this.currentLayer){
				layerItem.selectLayer();
			}
		},

		getCurrentLayer: function(){
			return this.currentLayer;
		},

	});


	return LayerManager;
})